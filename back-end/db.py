import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Get environment variables
mongo_uri = os.getenv("MONGO_URI")
db_name = os.getenv("MONGO_DB_NAME")
collection_name = os.getenv("MONGO_COLLECTION_NAME")

# Ensure the URI has the correct parameters
if "retryWrites" not in mongo_uri:
    mongo_uri += "&retryWrites=true&w=majority"
if "tls" not in mongo_uri:
    mongo_uri += "&tls=true"

# Initialize MongoDB client with simplified SSL settings
client = AsyncIOMotorClient(
    mongo_uri,
    tls=True,
    tlsInsecure=True,  # Disables hostname verification
    connectTimeoutMS=30000,  # 30 seconds
    socketTimeoutMS=None,  # No timeout for operations
    serverSelectionTimeoutMS=30000,  # 30 seconds
    maxPoolSize=50,  # Maximum number of connections
    minPoolSize=5,   # Minimum number of connections
    retryWrites=True
)

db = client[db_name]
mcqs_collection = db[collection_name]
student_scores_collection = db["student_scores"]
student_profiles_collection = db["student_profiles"]