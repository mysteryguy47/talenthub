"""Database models for the application."""
from sqlalchemy import Column, Integer, String, JSON, DateTime, Float, Boolean, ForeignKey, Text, create_engine, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()


class Paper(Base):
    """Paper model to store paper configurations."""
    __tablename__ = "papers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    level = Column(String, nullable=False)
    config = Column(JSON, nullable=False)  # Stores the full paper configuration
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    """User model for students and admins."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    display_name = Column(String, nullable=True)  # Custom display name for practice sessions
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="student", nullable=False)  # "student" or "admin"
    total_points = Column(Integer, default=0, nullable=False)
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    last_practice_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    practice_sessions = relationship("PracticeSession", back_populates="user", cascade="all, delete-orphan")
    paper_attempts = relationship("PaperAttempt", back_populates="user", cascade="all, delete-orphan")
    rewards = relationship("Reward", back_populates="user", cascade="all, delete-orphan")


class PracticeSession(Base):
    """Practice session model to track each practice attempt."""
    __tablename__ = "practice_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    operation_type = Column(String, nullable=False)  # e.g., "add_sub", "multiplication"
    difficulty_mode = Column(String, nullable=False)  # "custom", "easy", "medium", "hard"
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, default=0, nullable=False)
    wrong_answers = Column(Integer, default=0, nullable=False)
    accuracy = Column(Float, default=0.0, nullable=False)  # Percentage
    score = Column(Integer, default=0, nullable=False)
    time_taken = Column(Float, nullable=False)  # in seconds
    points_earned = Column(Integer, default=0, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="practice_sessions")
    attempts = relationship("Attempt", back_populates="session", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_user_created', 'user_id', 'started_at'),
    )


class Attempt(Base):
    """Individual question attempt within a practice session."""
    __tablename__ = "attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("practice_sessions.id"), nullable=False, index=True)
    question_data = Column(JSON, nullable=False)  # Stores question details
    user_answer = Column(Float, nullable=True)
    correct_answer = Column(Float, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    time_taken = Column(Float, nullable=False)  # Time to answer in seconds
    question_number = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    session = relationship("PracticeSession", back_populates="attempts")


class Reward(Base):
    """Rewards and badges earned by users."""
    __tablename__ = "rewards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    badge_type = Column(String, nullable=False)  # e.g., "accuracy_king", "speed_star", "streak_7"
    badge_name = Column(String, nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="rewards")
    
    __table_args__ = (
        Index('idx_user_badge', 'user_id', 'badge_type'),
    )


class PaperAttempt(Base):
    """Paper attempt model to track attempts on custom generated papers."""
    __tablename__ = "paper_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    paper_title = Column(String, nullable=False)
    paper_level = Column(String, nullable=False)
    paper_config = Column(JSON, nullable=False)  # Stores the full paper configuration
    generated_blocks = Column(JSON, nullable=False)  # Stores the generated questions
    seed = Column(Integer, nullable=False)  # Seed used for generation
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, default=0, nullable=False)
    wrong_answers = Column(Integer, default=0, nullable=False)
    accuracy = Column(Float, default=0.0, nullable=False)  # Percentage
    score = Column(Integer, default=0, nullable=False)
    time_taken = Column(Float, nullable=True)  # in seconds, null if not completed
    points_earned = Column(Integer, default=0, nullable=False)
    answers = Column(JSON, nullable=True)  # Stores user answers: {question_id: answer}
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="paper_attempts")
    
    __table_args__ = (
        Index('idx_paper_user_created', 'user_id', 'started_at'),
    )


class Leaderboard(Base):
    """Leaderboard entries for ranking users."""
    __tablename__ = "leaderboard"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    total_points = Column(Integer, default=0, nullable=False)
    rank = Column(Integer, nullable=True)  # Updated periodically
    weekly_points = Column(Integer, default=0, nullable=False)
    weekly_rank = Column(Integer, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_points_rank', 'total_points', 'rank'),
        Index('idx_weekly_points', 'weekly_points', 'weekly_rank'),
    )


# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgresql://",
            "postgresql+psycopg2://"
        ) + "?sslmode=require"
else:
    # Local fallback
    DATABASE_URL = "sqlite:///./abacus_replitt.db"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

