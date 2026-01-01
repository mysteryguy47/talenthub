"""Pydantic schemas for user-related models."""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    name: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    google_id: str
    role: str = "student"


class UserResponse(UserBase):
    id: int
    role: str
    total_points: int
    current_streak: int
    longest_streak: int
    created_at: datetime
    
    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    token: str  # Google OAuth token


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class PracticeSessionCreate(BaseModel):
    operation_type: str
    difficulty_mode: str
    total_questions: int
    correct_answers: int
    wrong_answers: int
    accuracy: float
    score: int
    time_taken: float
    points_earned: int
    attempts: List[dict]  # List of attempt data


class AttemptResponse(BaseModel):
    id: int
    question_data: dict
    user_answer: Optional[float]
    correct_answer: float
    is_correct: bool
    time_taken: float
    question_number: int
    created_at: datetime
    
    model_config = {"from_attributes": True}


class PracticeSessionResponse(BaseModel):
    id: int
    operation_type: str
    difficulty_mode: str
    total_questions: int
    correct_answers: int
    wrong_answers: int
    accuracy: float
    score: int
    time_taken: float
    points_earned: int
    started_at: datetime
    completed_at: Optional[datetime]
    
    model_config = {"from_attributes": True}


class PracticeSessionDetailResponse(PracticeSessionResponse):
    attempts: List[AttemptResponse]


class StudentStats(BaseModel):
    total_sessions: int
    total_questions: int
    total_correct: int
    total_wrong: int
    overall_accuracy: float
    total_points: int
    current_streak: int
    longest_streak: int
    badges: List[str]
    recent_sessions: List[PracticeSessionResponse]


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    name: str
    avatar_url: Optional[str]
    total_points: int
    weekly_points: int


class AdminStats(BaseModel):
    total_students: int
    total_sessions: int
    total_questions: int
    average_accuracy: float
    active_students_today: int
    top_students: List[LeaderboardEntry]

