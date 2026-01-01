"""Gamification logic for points, badges, and streaks."""
from sqlalchemy.orm import Session
from models import User, Reward, PracticeSession
from datetime import datetime, timedelta
from typing import List, Optional


def calculate_points(
    correct_answers: int,
    total_questions: int,
    time_taken: float,
    difficulty_mode: str,
    accuracy: float
) -> int:
    """Calculate points earned for a practice session."""
    base_points = correct_answers * 10
    
    # Speed bonus (faster = more points)
    avg_time_per_question = time_taken / total_questions if total_questions > 0 else 0
    if avg_time_per_question < 2:
        speed_bonus = correct_answers * 5
    elif avg_time_per_question < 5:
        speed_bonus = correct_answers * 3
    else:
        speed_bonus = 0
    
    # Difficulty multiplier
    difficulty_multiplier = {
        "easy": 1.0,
        "medium": 1.5,
        "hard": 2.0,
        "custom": 1.0
    }.get(difficulty_mode, 1.0)
    
    # Accuracy bonus
    accuracy_bonus = 0
    if accuracy >= 90:
        accuracy_bonus = total_questions * 5
    elif accuracy >= 80:
        accuracy_bonus = total_questions * 3
    elif accuracy >= 70:
        accuracy_bonus = total_questions * 2
    
    total_points = int(
        (base_points + speed_bonus + accuracy_bonus) * difficulty_multiplier
    )
    
    return total_points


def check_and_award_badges(
    db: Session,
    user: User,
    session: PracticeSession
) -> List[str]:
    """Check if user qualifies for badges and award them."""
    awarded_badges = []
    
    # Accuracy King - 95%+ accuracy in a session
    if session.accuracy >= 95:
        badge_type = "accuracy_king"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="Accuracy King"
            )
            db.add(reward)
            awarded_badges.append("Accuracy King")
    
    # Speed Star - Average < 2 seconds per question
    avg_time = session.time_taken / session.total_questions if session.total_questions > 0 else 0
    if avg_time < 2 and session.total_questions >= 10:
        badge_type = "speed_star"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="Speed Star"
            )
            db.add(reward)
            awarded_badges.append("Speed Star")
    
    # Perfect Score - 100% accuracy
    if session.accuracy == 100 and session.total_questions >= 5:
        badge_type = "perfect_score"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="Perfect Score"
            )
            db.add(reward)
            awarded_badges.append("Perfect Score")
    
    # Streak badges
    if user.current_streak >= 7:
        badge_type = "streak_7"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="7-Day Streak"
            )
            db.add(reward)
            awarded_badges.append("7-Day Streak")
    
    if user.current_streak >= 30:
        badge_type = "streak_30"
        existing = db.query(Reward).filter(
            Reward.user_id == user.id,
            Reward.badge_type == badge_type
        ).first()
        if not existing:
            reward = Reward(
                user_id=user.id,
                badge_type=badge_type,
                badge_name="30-Day Streak"
            )
            db.add(reward)
            awarded_badges.append("30-Day Streak")
    
    return awarded_badges


def update_streak(db: Session, user: User) -> None:
    """Update user's practice streak."""
    today = datetime.utcnow().date()
    
    if user.last_practice_date:
        last_date = user.last_practice_date.date()
        days_diff = (today - last_date).days
        
        if days_diff == 0:
            # Same day, no change
            pass
        elif days_diff == 1:
            # Consecutive day
            user.current_streak += 1
            if user.current_streak > user.longest_streak:
                user.longest_streak = user.current_streak
        else:
            # Streak broken
            user.current_streak = 1
    else:
        # First practice
        user.current_streak = 1
    
    user.last_practice_date = datetime.utcnow()
    db.commit()


