from fastapi import APIRouter, HTTPException, status, Depends, Response
from db import users_collection
from schemas import UserCreate, UserLogin, UserOut, Token, MessageResponse
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
from bson import ObjectId
from datetime import datetime
from fastapi.security import OAuth2PasswordBearer
# from main import blacklist 

router = APIRouter(prefix="/api", tags=["users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register", response_model=MessageResponse)
async def register(user: UserCreate):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "fullname": user.fullname,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_dict)
    
    return MessageResponse(message=f"User {user.fullname} registered successfully")

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    # Find user
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": db_user["email"]}, expires_delta=access_token_expires
    )
    
    user_out = UserOut(id=str(db_user["_id"]), fullname=db_user["fullname"], email=db_user["email"])
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_out
    )

blacklist = set()

@router.post("/logout")
def logout(response: Response, token: str = Depends(oauth2_scheme)):
    blacklist.add(token)  # mark token as invalid
    response.delete_cookie("session_token")  # if you’re using cookies
    return {"message": "User logged out successfully"}

@router.get("/me", response_model=UserOut)
async def get_me(current_user: UserOut = Depends(get_current_user)):
    return current_user

@router.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserOut(id=str(user["_id"]), fullname=user["fullname"], email=user["email"])