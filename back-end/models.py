from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class MCQ(BaseModel):
    question: str
    options: Dict[str, str]
    answer: str
    explanation: str
    difficulty: str

class MCQSet(BaseModel):
    subject: str
    chapter: str
    summary: List[str]
    mcqs: List[MCQ]

class QuizScore(BaseModel):
    subject: str
    chapter: str
    score: int
    date: datetime = Field(default_factory=datetime.utcnow)

# Main database model for student profile
class StudentInDB(BaseModel):
    roll_no: int
    name: str
    hashed_password: str
    scores: List[QuizScore] = []

# Model for creating a new user
class StudentCreate(BaseModel):
    roll_no: int
    name: str
    password: str

# Model for login
class StudentLogin(BaseModel):
    roll_no: int
    password: str

# Model for the token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    roll_no: Optional[int] = None

# Authentication Response Model
class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: StudentInDB