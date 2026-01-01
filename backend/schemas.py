"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Literal
from datetime import datetime


# Question Types
QuestionType = Literal[
    "addition", "subtraction", "add_sub", "multiplication", "division", "square_root", "cube_root", 
    "decimal_multiplication", "lcm", "gcd", "integer_add_sub", "decimal_division", "decimal_add_sub", 
    "direct_add_sub", "small_friends_add_sub", "big_friends_add_sub", "percentage",
    # Vedic Maths Level 1 operations
    "vedic_multiply_by_11", "vedic_multiply_by_101", "vedic_subtraction_complement", "vedic_subtraction_normal",
    "vedic_multiply_by_12_19", "vedic_special_products_base_100", "vedic_special_products_base_50",
    "vedic_multiply_by_21_91", "vedic_addition", "vedic_multiply_by_2", "vedic_multiply_by_4",
    "vedic_divide_by_2", "vedic_divide_by_4", "vedic_divide_single_digit", "vedic_multiply_by_6",
    "vedic_divide_by_11", "vedic_squares_base_10", "vedic_squares_base_100", "vedic_squares_base_1000", "vedic_tables"
]
PaperLevel = Literal["Custom", "Junior", "AB-1", "AB-2", "AB-3", "AB-4", "AB-5", "AB-6", "AB-7", "AB-8", "AB-9", "AB-10", "Advanced", "Vedic-Level-1", "Vedic-Level-2", "Vedic-Level-3", "Vedic-Level-4"]


class Constraints(BaseModel):
    """Constraints for question generation."""
    model_config = ConfigDict(populate_by_name=True)
    
    digits: Optional[int] = Field(default=None, ge=1, le=30)  # Max 30 for vedic operations, but clamped appropriately in code for other operations
    rows: Optional[int] = Field(default=None, ge=2, le=30)  # Updated max to 30
    allowBorrow: Optional[bool] = Field(default=True)
    allowCarry: Optional[bool] = Field(default=True)
    minAnswer: Optional[int] = None
    maxAnswer: Optional[int] = None
    dividendDigits: Optional[int] = Field(default=None, ge=1, le=20)  # Updated max to 20
    divisorDigits: Optional[int] = Field(default=None, ge=1, le=20)  # Updated max to 20
    multiplicandDigits: Optional[int] = Field(default=None, ge=1, le=20)  # Updated max to 20
    multiplierDigits: Optional[int] = Field(default=None, ge=0, le=20)  # Updated max to 20, 0 = whole number for decimal_multiplication
    # For square root and cube root: digits of the number under the root
    rootDigits: Optional[int] = Field(default=None, ge=1, le=30)  # Updated max to 30
    # For percentage: percentage value range and number digits
    percentageMin: Optional[int] = Field(default=None, ge=1, le=100)  # Minimum percentage (default 1)
    percentageMax: Optional[int] = Field(default=None, ge=1, le=100)  # Maximum percentage (default 100)
    numberDigits: Optional[int] = Field(default=None, ge=1, le=10)  # Updated max to 10 for percentage number digits
    # For Vedic Maths operations
    base: Optional[int] = Field(default=None)  # For subtraction (100, 1000, etc) and special products
    firstDigits: Optional[int] = Field(default=None, ge=1, le=30)  # Updated min to 1, max to 30 for vedic addition
    secondDigits: Optional[int] = Field(default=None, ge=1, le=30)  # Updated min to 1, max to 30 for vedic addition
    multiplier: Optional[int] = Field(default=None, ge=12, le=19)  # For multiply by 12-19
    multiplierRange: Optional[int] = Field(default=None, ge=21, le=91)  # For multiply by 21-91
    divisor: Optional[int] = Field(default=None, ge=2, le=9)  # For divide by single digit
    tableNumber: Optional[int] = Field(default=None, ge=1, le=99)  # Updated min to 1 for tables


class BlockConfig(BaseModel):
    """Configuration for a block of questions."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    type: QuestionType
    count: int = Field(ge=1, le=200, default=10)  # Updated max to 200
    constraints: Constraints
    title: Optional[str] = None


class PaperConfig(BaseModel):
    """Full paper configuration."""
    model_config = ConfigDict(populate_by_name=True)
    
    level: PaperLevel = "Custom"
    title: str = Field(min_length=1)
    totalQuestions: Literal["10", "20", "30", "50", "100"] = Field(default="20")
    blocks: List[BlockConfig]
    orientation: Literal["portrait", "landscape"] = "portrait"


class Question(BaseModel):
    """Generated question."""
    model_config = ConfigDict(populate_by_name=True)
    
    id: int
    text: str
    operands: List[int]  # For decimal multiplication, operands may be floats stored as ints (multiply by 10)
    operator: str
    operators: Optional[List[str]] = None  # For mixed operations: list of operators for each operand (except first)
    answer: float  # Changed to float to support decimal answers
    isVertical: bool


class GeneratedBlock(BaseModel):
    """Generated block with questions."""
    model_config = ConfigDict(populate_by_name=True)
    
    config: BlockConfig
    questions: List[Question]


class PaperCreate(BaseModel):
    """Request schema for creating a paper."""
    model_config = ConfigDict(populate_by_name=True)
    
    title: str
    level: str
    config: PaperConfig


class PaperResponse(BaseModel):
    """Response schema for a paper."""
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    id: int
    title: str
    level: str
    config: PaperConfig
    createdAt: datetime = Field(alias="created_at")


class PreviewResponse(BaseModel):
    """Response schema for preview."""
    model_config = ConfigDict(populate_by_name=True)
    
    blocks: List[GeneratedBlock]
    seed: int
