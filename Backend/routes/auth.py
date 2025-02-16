import os
import httpx
from fastapi import APIRouter, HTTPException, Form
from database import users_collection
import bcrypt
import jwt
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY")
ALGORITHM = "HS256"

async def verify_recaptcha(token: str) -> bool:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": RECAPTCHA_SECRET_KEY, "response": token},
        )
        return response.json().get("success", False)

@router.post("/signup")
async def signup(email: str = Form(), password: str = Form(), recaptcha_token: str = Form()):
    if not await verify_recaptcha(recaptcha_token):
        raise HTTPException(status_code=400, detail="Invalid reCAPTCHA response")

    if await users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    await users_collection.insert_one({"email": email, "password": hashed_password})
    return {"message": "User registered"}

@router.post("/login")
async def login(email: str = Form(), password: str = Form(), recaptcha_token: str = Form()):
    if not await verify_recaptcha(recaptcha_token):
        raise HTTPException(status_code=400, detail="Invalid reCAPTCHA response")

    db_user = await users_collection.find_one({"email": email})
    if not db_user or not bcrypt.checkpw(password.encode(), db_user["password"].encode()):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = jwt.encode({"email": email}, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}
