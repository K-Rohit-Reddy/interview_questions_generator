from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get MongoDB credentials from environment variables
MONGO_USERNAME = os.getenv("MONGO_USERNAME").strip('"')
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD").strip('"')
MONGO_CLUSTER = os.getenv("MONGO_CLUSTER").strip('"')
DB_NAME = os.getenv("MONGO_DATABASE").strip('"')

# Construct MongoDB URI using environment variables
MONGO_URI = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_CLUSTER}.mongodb.net/?retryWrites=true&w=majority"

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
jobs_collection = db["jobs"]
templates_collection = db["templates"]
history_collection = db["history"]