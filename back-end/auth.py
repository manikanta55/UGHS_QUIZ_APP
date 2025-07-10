import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from bson import ObjectId

from db import student_profiles_collection
from models import StudentInDB, StudentCreate, AuthResponse, TokenData

load_dotenv()

router = APIRouter()

# --- Configuration ---
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# --- Password Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- JWT Creation ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Dependency to Get Current User ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # "token" is the login endpoint URL

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        roll_no: int = payload.get("sub")
        if roll_no is None:
            raise credentials_exception
        token_data = TokenData(roll_no=roll_no)
    except JWTError:
        raise credentials_exception

    user = await student_profiles_collection.find_one({"roll_no": token_data.roll_no})
    if user is None:
        raise credentials_exception
    
    # Return the full user profile as a Pydantic model
    return StudentInDB(**user)

@router.post("/signup", response_model=AuthResponse)
async def signup(student: StudentCreate):
    # Check if user already exists
    existing_user = await student_profiles_collection.find_one({"roll_no": student.roll_no})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student with this roll number already exists"
        )

    # Hash password
    hashed_password = get_password_hash(student.password)

    # Create new user
    new_user = StudentInDB(
        roll_no=student.roll_no,
        name=student.name,
        hashed_password=hashed_password,
        scores=[]
    )

    # Insert into database
    await student_profiles_collection.insert_one(new_user.dict())

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(student.roll_no)},
        expires_delta=access_token_expires
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=new_user
    )

@router.post("/token", response_model=AuthResponse)
async def login(student: StudentCreate):
    # Validate name format
    if not student.name.isalpha() and not all(c.isalpha() or c.isspace() for c in student.name):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name must contain only letters and spaces"
        )
    
    user = await student_profiles_collection.find_one({"roll_no": student.roll_no})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect roll number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify both name and password
    if user["name"].lower() != student.name.lower() or \
       not verify_password(student.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect roll number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["roll_no"])},
        expires_delta=access_token_expires
    )
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=StudentInDB(**user)
    )

@router.get("/subjects", dependencies=[Depends(get_current_user)])
async def get_subjects():
    # TODO: Implement subject fetching logic
    return ["Physics", "Chemistry", "Biology", "Mathematics"]

@router.get("/chapters/{subject}", dependencies=[Depends(get_current_user)])
async def get_chapters(subject: str):
    # TODO: Implement chapter fetching logic
    return ["Chapter 1", "Chapter 2", "Chapter 3"]

@router.get("/content/{subject}/{chapter}", dependencies=[Depends(get_current_user)])
async def get_chapter_content(subject: str, chapter: str):
    # TODO: Implement content fetching logic
    return {
        "summary": ["Chapter summary points"],
        "questions": []  # Will be populated with MCQs
    }

@router.post("/refresh_token", response_model=AuthResponse)
async def refresh_token(current_user: StudentInDB = Depends(get_current_user)):
    """Refresh the user's token when it has less than 5 minutes remaining."""
    try:
        # Get current token from Authorization header
        auth_header = current_user.get('headers', {}).get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token format",
                headers={"WWW-Authenticate": "Bearer"},
            )

        current_token = auth_header.split(' ')[1]
        
        # Decode current token to get expiry time
        decoded = jwt.decode(current_token, SECRET_KEY, algorithms=[ALGORITHM])
        expiry = datetime.fromtimestamp(decoded['exp'], timezone.utc)
        now = datetime.now(timezone.utc)
        remaining = (expiry - now).total_seconds()
        
        # Only refresh if token has less than 5 minutes remaining
        if remaining <= 300:  # 5 minutes in seconds
            # Generate new token
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            new_token = create_access_token(
                data={"sub": str(current_user.roll_no)},
                expires_delta=access_token_expires
            )
            return AuthResponse(
                access_token=new_token,
                token_type="bearer",
                user=current_user
            )
        
        # If token still has more than 5 minutes, return current token
        return AuthResponse(
            access_token=current_token,
            token_type="bearer",
            user=current_user
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/session")
async def check_session(current_user: StudentInDB = Depends(get_current_user)):
    """Check if the user's session is valid."""
    return {"status": "valid", "user": current_user}
