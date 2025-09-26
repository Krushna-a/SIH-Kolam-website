from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = "kolam_db"

# Async client for FastAPI
client = AsyncIOMotorClient(MONGO_URL)
database = client[DATABASE_NAME]

# Sync client for initial setup (optional)
sync_client = MongoClient(MONGO_URL)
sync_database = sync_client[DATABASE_NAME]

# Collections - Fixed naming
users_collection = database.users
products_collection = database.products
cart_collection = database.cart
orders_collection = database.orders

def get_database():
    return database