from fastapi import APIRouter, HTTPException, Form
from typing import Annotated
from database import users_collection
import bcrypt
import jwt
from datetime import datetime  # Can remove timedelta if not used elsewhere

SECRET_KEY = "your_very_secret_key"  # Replace with a secure key when deploying
ALGORITHM = "HS256"

router = APIRouter()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_token(email: str):
    """
    Creates a JWT token.
    The token payload contains the email.
    """
    payload = {"email": email}
    # jwt.encode returns a string (for PyJWT >=2.0)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
async def signup(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()]
):
    if await users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(password)
    await users_collection.insert_one({"email": email, "password": hashed_password})
    return {"message": "User registered"}

@router.post("/login")
async def login(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()]
):
    db_user = await users_collection.find_one({"email": email})
    if not db_user or not verify_password(password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token(email)
    return {"token": token}
