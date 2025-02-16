from fastapi import APIRouter, HTTPException, Form
from typing import Annotated
from database import users_collection
import bcrypt
import jwt
from datetime import datetime
import os
import httpx
import logging

router = APIRouter()

# Load these from your environment in production
SECRET_KEY = os.getenv("SECRET_KEY") or "your_very_secret_key"
ALGORITHM = "HS256"
HCAPTCHA_SECRET = os.getenv("HCAPTCHA_SECRET") or "your_hcaptcha_secret_key"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_token(email: str):
    payload = {"email": email}
    # PyJWT>=2.0 returns a string
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def verify_hcaptcha(token: str) -> bool:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://hcaptcha.com/siteverify",
            data={"secret": HCAPTCHA_SECRET, "response": token},
        )
        result = response.json()
        return result.get("success", False)

@router.post("/signup")
async def signup(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    hcaptcha_token: Annotated[str, Form()]
):
    # Verify hCaptcha token
    if not await verify_hcaptcha(hcaptcha_token):
        raise HTTPException(status_code=400, detail="Invalid hCaptcha response")

    if await users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(password)
    await users_collection.insert_one({"email": email, "password": hashed_password})
    return {"message": "User registered"}

@router.post("/login")
async def login(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    hcaptcha_token: Annotated[str, Form()]
):
    # Verify hCaptcha token
    if not await verify_hcaptcha(hcaptcha_token):
        raise HTTPException(status_code=400, detail="Invalid hCaptcha response")

    db_user = await users_collection.find_one({"email": email})
    if not db_user or not verify_password(password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token(email)
    return {"token": token}
