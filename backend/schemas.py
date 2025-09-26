from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

# User Schemas
class UserCreate(BaseModel):
    fullname: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    fullname: str
    email: EmailStr
    
    class Config:
        from_attributes = True

# Product Schemas
class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image: str
    seller: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image: Optional[str] = None

class ProductOut(BaseModel):
    id: str
    name: str
    category: str
    price: float
    description: str
    image: str  # This should be a string URL, not binary data
    seller: str

    class Config:
        json_encoders = {
            ObjectId: str
        }

# Cart Schemas
class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemOut(BaseModel):
    product_id: str
    name: str
    price: float
    image: str
    seller: str
    quantity: int

class CartOut(BaseModel):
    user_id: str
    items: List[CartItemOut]
    total_price: float

# Order Schemas
class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total_amount: float

class OrderOut(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    total_amount: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Response Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class MessageResponse(BaseModel):
    message: str