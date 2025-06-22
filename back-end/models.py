from pydantic import BaseModel
from typing import List, Dict

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
