from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import mcqs_collection, student_profiles_collection
from models import StudentInDB, StudentCreate, AuthResponse, TokenData, QuizScore
from datetime import datetime
from auth import router as auth_router, get_current_user

app = FastAPI()

# Include the auth router
app.include_router(auth_router, prefix="/auth", tags=["auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to UGHS Quiz App API"}

@app.get("/test-db")
async def test_db():
    try:
        # Test the connection
        await mcqs_collection.find_one({})
        return {"status": "success", "message": "Successfully connected to MongoDB!"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}

@app.get("/quizzes/{subject}/{chapter}")
async def get_quiz(subject: str, chapter: str):
    doc = await mcqs_collection.find_one({"subject": subject, "chapter": chapter})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

@app.post("/scores", response_model=dict)
async def save_quiz_score(score: QuizScore, current_user: StudentInDB = Depends(get_current_user)):
    """
    Save a quiz score for the current user.
    
    Args:
        score: QuizScore object containing subject, chapter, and score
        current_user: Currently authenticated user
    
    Returns:
        dict: Success message with score details
    """
    try:
        # Convert the QuizScore to a dictionary
        score_dict = score.model_dump()
        
        # Update user's scores
        await student_profiles_collection.update_one(
            {"roll_no": current_user.roll_no},
            {"$push": {"scores": score_dict}}
        )
        
        return {
            "message": "Score saved successfully",
            "score": score_dict
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save score: {str(e)}"
        )

@app.get("/chapters", response_model=dict)
async def get_chapters():
    """
    Get all chapters for each subject.
    """
    try:
        # Get distinct subjects and their chapters
        chapters_by_subject = {}
        async for doc in mcqs_collection.find({}, {"subject": 1, "chapter": 1, "_id": 0}):
            subject = doc["subject"]
            chapter = doc["chapter"]
            if subject not in chapters_by_subject:
                chapters_by_subject[subject] = set()
            chapters_by_subject[subject].add(chapter)
        
        # Convert sets to sorted lists
        for subject in chapters_by_subject:
            chapters_by_subject[subject] = sorted(list(chapters_by_subject[subject]))
        
        return {
            "message": "Chapters retrieved successfully",
            "chapters": chapters_by_subject
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve chapters: {str(e)}"
        )

@app.get("/scores", response_model=dict)
async def get_student_scores(current_user: StudentInDB = Depends(get_current_user)):
    """
    Get all quiz scores for the current user.
    
    Args:
        current_user: Currently authenticated user
    
    Returns:
        dict: User's scores grouped by subject
    """
    try:
        # Get the user's scores from the database
        user = await student_profiles_collection.find_one(
            {"roll_no": current_user.roll_no},
            {"scores": 1, "_id": 0}
        )
        
        if not user or not user.get("scores"):
            return {
                "message": "No scores found",
                "scores": {}
            }
        
        # Group scores by subject
        scores_by_subject = {}
        for score in user["scores"]:
            subject = score["subject"]
            if subject not in scores_by_subject:
                scores_by_subject[subject] = []
            scores_by_subject[subject].append(score)
        
        return {
            "message": "Scores retrieved successfully",
            "scores": scores_by_subject
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve scores: {str(e)}"
        )
