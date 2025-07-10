import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB_NAME")]
mcqs_collection = db[os.getenv("MONGO_COLLECTION_NAME")]
student_scores_collection = db["student_scores"]
student_profiles_collection = db["student_profiles"]