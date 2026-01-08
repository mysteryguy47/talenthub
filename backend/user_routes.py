"""API routes for user authentication, progress tracking, and dashboards."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from datetime import datetime, timedelta

from models import User, PracticeSession, Attempt, Reward, Leaderboard, PaperAttempt, Paper, get_db
from auth import get_current_user, get_current_admin, verify_google_token, create_access_token
from user_schemas import (
    LoginRequest, LoginResponse, UserResponse, PracticeSessionCreate,
    PracticeSessionResponse, StudentStats, LeaderboardEntry, AdminStats,
    PracticeSessionDetailResponse, AttemptResponse
)
from pydantic import BaseModel
from typing import Optional

class UpdateDisplayNameRequest(BaseModel):
    display_name: Optional[str] = None

from gamification import calculate_points, check_and_award_badges, update_streak, check_and_award_super_rewards
from leaderboard_service import (
    update_leaderboard, update_weekly_leaderboard,
    get_overall_leaderboard, get_weekly_leaderboard
)

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with Google OAuth token."""
    try:
        print(f"Login attempt received, token length: {len(login_data.token) if login_data.token else 0}")
        # Verify Google token
        user_info = verify_google_token(login_data.token)
        print(f"Token verified, user info: {user_info.get('email', 'N/A')}")
        
        # Find or create user
        user = db.query(User).filter(User.google_id == user_info["google_id"]).first()
        
        # Check if admin email (you can set this in environment)
        import os
        admin_emails = [email.strip() for email in os.getenv("ADMIN_EMAILS", "").split(",") if email.strip()]
        is_admin_email = user_info["email"] in admin_emails
        
        if not user:
            # New user - assign role based on admin emails
            role = "admin" if is_admin_email else "student"
            
            user = User(
                google_id=user_info["google_id"],
                email=user_info["email"],
                name=user_info["name"],
                avatar_url=user_info.get("avatar_url"),
                role=role
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Create leaderboard entry
            from models import Leaderboard
            leaderboard = Leaderboard(user_id=user.id, total_points=0)
            db.add(leaderboard)
            db.commit()
        else:
            # Existing user - update info and check if role needs updating
            user.name = user_info["name"]
            user.avatar_url = user_info.get("avatar_url")
            
            # Update role if email is in admin list (promote to admin)
            # Or demote if email is removed from admin list (but keep existing admins unless explicitly removed)
            if is_admin_email and user.role != "admin":
                print(f"🔄 [AUTH] Promoting user {user.email} to admin (found in ADMIN_EMAILS)")
                user.role = "admin"
            elif not is_admin_email and user.role == "admin":
                # Only demote if explicitly not in admin list (optional - comment out if you want to keep existing admins)
                # Uncomment the next line if you want to automatically demote admins removed from ADMIN_EMAILS
                # print(f"🔄 [AUTH] Demoting user {user.email} from admin (not in ADMIN_EMAILS)")
                # user.role = "student"
                pass
            
            db.commit()
        
        # Create access token - sub must be a string for JWT
        access_token = create_access_token(data={"sub": str(user.id)})
        
        print(f"Login successful for user: {user.email}")
        return LoginResponse(
            access_token=access_token,
            user=UserResponse.model_validate(user)
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Login error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info."""
    return UserResponse.model_validate(current_user)


@router.put("/me/display-name", response_model=UserResponse)
async def update_display_name(
    request: UpdateDisplayNameRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's display name."""
    current_user.display_name = request.display_name
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.post("/practice-session", response_model=PracticeSessionResponse)
async def save_practice_session(
    session_data: PracticeSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a practice session with all attempts."""
    # Calculate points for mental math: 10 points per question attempted
    points_earned = calculate_points(
        correct_answers=session_data.correct_answers,
        total_questions=session_data.total_questions,
        time_taken=session_data.time_taken,
        difficulty_mode=session_data.difficulty_mode,
        accuracy=session_data.accuracy,
        is_mental_math=True  # Mental math practice
    )
    
    # Create practice session
    session = PracticeSession(
        user_id=current_user.id,
        operation_type=session_data.operation_type,
        difficulty_mode=session_data.difficulty_mode,
        total_questions=session_data.total_questions,
        correct_answers=session_data.correct_answers,
        wrong_answers=session_data.wrong_answers,
        accuracy=session_data.accuracy,
        score=session_data.score,
        time_taken=session_data.time_taken,
        points_earned=points_earned,
        completed_at=datetime.utcnow()
    )
    db.add(session)
    db.flush()  # Get session ID
    
    # Save attempts
    for attempt_data in session_data.attempts:
        attempt = Attempt(
            session_id=session.id,
            question_data=attempt_data.get("question_data", {}),
            user_answer=attempt_data.get("user_answer"),
            correct_answer=attempt_data.get("correct_answer"),
            is_correct=attempt_data.get("is_correct", False),
            time_taken=attempt_data.get("time_taken", 0),
            question_number=attempt_data.get("question_number", 0)
        )
        db.add(attempt)
    
    # Update user points and streak
    current_user.total_points += points_earned
    update_streak(db, current_user, questions_practiced_today=session_data.total_questions)
    
    # Check for badges
    badges = check_and_award_badges(db, current_user, session)
    
    # Check for SUPER badge rewards
    super_rewards = check_and_award_super_rewards(db, current_user)
    
    db.commit()
    db.refresh(session)
    
    # Update leaderboards
    update_leaderboard(db)
    update_weekly_leaderboard(db)
    
    return PracticeSessionResponse.model_validate(session)


@router.get("/stats", response_model=StudentStats)
async def get_student_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get student statistics and progress."""
    # Get session stats
    sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == current_user.id
    ).all()
    
    total_sessions = len(sessions)
    total_questions = sum(s.total_questions for s in sessions)
    total_correct = sum(s.correct_answers for s in sessions)
    total_wrong = sum(s.wrong_answers for s in sessions)
    overall_accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    # Get badges
    badges = db.query(Reward).filter(Reward.user_id == current_user.id).all()
    badge_names = [badge.badge_name for badge in badges]
    
    # Get recent sessions
    recent_sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == current_user.id
    ).order_by(desc(PracticeSession.started_at)).limit(10).all()
    
    return StudentStats(
        total_sessions=total_sessions,
        total_questions=total_questions,
        total_correct=total_correct,
        total_wrong=total_wrong,
        overall_accuracy=round(overall_accuracy, 2),
        total_points=current_user.total_points,
        current_streak=current_user.current_streak,
        longest_streak=current_user.longest_streak,
        badges=badge_names,
        recent_sessions=[PracticeSessionResponse.model_validate(s) for s in recent_sessions]
    )


@router.get("/practice-session/{session_id}", response_model=PracticeSessionDetailResponse)
async def get_practice_session_detail(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed practice session with all attempts."""
    session = db.query(PracticeSession).filter(
        PracticeSession.id == session_id,
        PracticeSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get all attempts for this session
    attempts = db.query(Attempt).filter(
        Attempt.session_id == session_id
    ).order_by(Attempt.question_number).all()
    
    return PracticeSessionDetailResponse(
        id=session.id,
        operation_type=session.operation_type,
        difficulty_mode=session.difficulty_mode,
        total_questions=session.total_questions,
        correct_answers=session.correct_answers,
        wrong_answers=session.wrong_answers,
        accuracy=session.accuracy,
        score=session.score,
        time_taken=session.time_taken,
        points_earned=session.points_earned,
        started_at=session.started_at,
        completed_at=session.completed_at,
        attempts=[AttemptResponse.model_validate(a) for a in attempts]
    )


@router.get("/leaderboard/overall", response_model=List[LeaderboardEntry])
async def get_overall_leaderboard_endpoint(db: Session = Depends(get_db)):
    """Get overall leaderboard."""
    entries = get_overall_leaderboard(db)
    return [LeaderboardEntry(**entry) for entry in entries]


@router.get("/leaderboard/weekly", response_model=List[LeaderboardEntry])
async def get_weekly_leaderboard_endpoint(db: Session = Depends(get_db)):
    """Get weekly leaderboard."""
    entries = get_weekly_leaderboard(db)
    return [LeaderboardEntry(**entry) for entry in entries]


# Admin routes
@router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics."""
    # Total students
    total_students = db.query(User).filter(User.role == "student").count()
    
    # Total sessions
    total_sessions = db.query(PracticeSession).count()
    
    # Total questions
    total_questions = db.query(func.sum(PracticeSession.total_questions)).scalar() or 0
    
    # Average accuracy
    avg_accuracy = db.query(func.avg(PracticeSession.accuracy)).scalar() or 0
    
    # Active students today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    active_today = db.query(func.count(func.distinct(PracticeSession.user_id))).filter(
        PracticeSession.started_at >= today_start
    ).scalar() or 0
    
    # Top students
    top_students = get_overall_leaderboard(db, limit=10)
    
    return AdminStats(
        total_students=total_students,
        total_sessions=total_sessions,
        total_questions=int(total_questions),
        average_accuracy=round(float(avg_accuracy), 2),
        active_students_today=active_today,
        top_students=[LeaderboardEntry(**entry) for entry in top_students]
    )


@router.get("/admin/students", response_model=List[UserResponse])
async def get_all_students(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all students."""
    students = db.query(User).filter(User.role == "student").order_by(
        desc(User.total_points)
    ).all()
    return [UserResponse.model_validate(s) for s in students]


@router.get("/admin/students/{student_id}/stats", response_model=StudentStats)
async def get_student_stats_admin(
    student_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get stats for a specific student (admin view)."""
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Reuse the stats logic
    sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == student.id
    ).all()
    
    total_sessions = len(sessions)
    total_questions = sum(s.total_questions for s in sessions)
    total_correct = sum(s.correct_answers for s in sessions)
    total_wrong = sum(s.wrong_answers for s in sessions)
    overall_accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    badges = db.query(Reward).filter(Reward.user_id == student.id).all()
    badge_names = [badge.badge_name for badge in badges]
    
    recent_sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == student.id
    ).order_by(desc(PracticeSession.started_at)).limit(10).all()
    
    return StudentStats(
        total_sessions=total_sessions,
        total_questions=total_questions,
        total_correct=total_correct,
        total_wrong=total_wrong,
        overall_accuracy=round(overall_accuracy, 2),
        total_points=student.total_points,
        current_streak=student.current_streak,
        longest_streak=student.longest_streak,
        badges=badge_names,
        recent_sessions=[PracticeSessionResponse.model_validate(s) for s in recent_sessions]
    )


class UpdatePointsRequest(BaseModel):
    points: int


class DatabaseStatsResponse(BaseModel):
    total_users: int
    total_students: int
    total_admins: int
    total_sessions: int
    total_paper_attempts: int
    total_rewards: int
    total_papers: int
    database_size_mb: float


@router.delete("/admin/students/{student_id}")
async def delete_student(
    student_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a student account and all associated data."""
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Delete associated data (cascade should handle most, but we'll be explicit)
    # Delete leaderboard entry
    leaderboard = db.query(Leaderboard).filter(Leaderboard.user_id == student_id).first()
    if leaderboard:
        db.delete(leaderboard)
    
    # Delete user (cascade will handle sessions, attempts, rewards, paper_attempts)
    db.delete(student)
    db.commit()
    
    # Refresh leaderboard after deletion
    update_leaderboard(db)
    update_weekly_leaderboard(db)
    
    return {"message": f"Student {student.name} deleted successfully"}


@router.put("/admin/students/{student_id}/points")
async def update_student_points(
    student_id: int,
    request: UpdatePointsRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a student's total points."""
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    old_points = student.total_points
    student.total_points = max(0, request.points)  # Ensure non-negative
    db.commit()
    
    # Update leaderboard entry
    leaderboard = db.query(Leaderboard).filter(Leaderboard.user_id == student_id).first()
    if leaderboard:
        leaderboard.total_points = student.total_points
        db.commit()
    
    # Refresh leaderboard rankings
    update_leaderboard(db)
    
    return {
        "message": f"Points updated for {student.name}",
        "old_points": old_points,
        "new_points": student.total_points
    }


@router.post("/admin/leaderboard/refresh")
async def refresh_leaderboard(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Manually refresh both overall and weekly leaderboards."""
    update_leaderboard(db)
    update_weekly_leaderboard(db)
    return {"message": "Leaderboard refreshed successfully"}


@router.get("/admin/database/stats", response_model=DatabaseStatsResponse)
async def get_database_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get database statistics."""
    total_users = db.query(User).count()
    total_students = db.query(User).filter(User.role == "student").count()
    total_admins = db.query(User).filter(User.role == "admin").count()
    total_sessions = db.query(PracticeSession).count()
    total_paper_attempts = db.query(PaperAttempt).count()
    total_rewards = db.query(Reward).count()
    total_papers = db.query(Paper).count()
    
    # Estimate database size (SQLite)
    import os
    db_path = os.getenv("DATABASE_URL", "sqlite:///./abacus_replitt.db")
    if db_path.startswith("sqlite:///"):
        db_file = db_path.replace("sqlite:///", "")
        if os.path.exists(db_file):
            db_size_mb = os.path.getsize(db_file) / (1024 * 1024)
        else:
            db_size_mb = 0.0
    else:
        db_size_mb = 0.0  # PostgreSQL size calculation would be different
    
    return DatabaseStatsResponse(
        total_users=total_users,
        total_students=total_students,
        total_admins=total_admins,
        total_sessions=total_sessions,
        total_paper_attempts=total_paper_attempts,
        total_rewards=total_rewards,
        total_papers=total_papers,
        database_size_mb=round(db_size_mb, 2)
    )


@router.post("/admin/promote-self")
async def promote_self_to_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allow users to promote themselves to admin if their email is in ADMIN_EMAILS.
    This is useful for fixing existing users who should be admins.
    """
    import os
    admin_emails = [email.strip() for email in os.getenv("ADMIN_EMAILS", "").split(",") if email.strip()]
    
    if current_user.email not in admin_emails:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your email is not in the ADMIN_EMAILS list. Contact system administrator."
        )
    
    if current_user.role == "admin":
        return {
            "message": "You are already an admin",
            "email": current_user.email,
            "role": current_user.role
        }
    
    # Promote to admin
    current_user.role = "admin"
    db.commit()
    
    return {
        "message": f"Successfully promoted {current_user.email} to admin",
        "email": current_user.email,
        "role": current_user.role
    }

