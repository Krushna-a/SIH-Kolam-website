# backend/routers/payment.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import razorpay
from db import database  # Your MongoDB client

RAZORPAY_KEY_ID="rzp_live_RMzWRODq0wzJ9W"
RAZORPAY_KEY_SECRET="X0UezYXhhTQtMZtZ7NsNc612"

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

# Razorpay client
# razorpay_client = razorpay.Client(
#     auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET"))
# )

payment_router = APIRouter(prefix="/api/payment", tags=["payment"])

# Models
class CreateOrderRequest(BaseModel):
    amount: int  # Amount in paise
    email: str = None  # Optional guest email

class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
    email: str = None

class OrderResponse(BaseModel):
    id: str
    amount: int
    currency: str
    status: str

# Create Razorpay order
@payment_router.post("/create-order", response_model=OrderResponse)
async def create_order(order_data: CreateOrderRequest):
    if order_data.amount < 100:
        raise HTTPException(status_code=400, detail="Amount must be >= 1 INR")

    order = razorpay_client.order.create(data={
        "amount": order_data.amount,
        "currency": "INR",
        "payment_capture": 1,
        "notes": {"email": order_data.email or "guest"}
    })

    return OrderResponse(
        id=order["id"],
        amount=order["amount"],
        currency=order["currency"],
        status=order["status"]
    )

# Verify payment
@payment_router.post("/verify-payment")
async def verify_payment(data: VerifyPaymentRequest):
    params_dict = {
        "razorpay_order_id": data.razorpay_order_id,
        "razorpay_payment_id": data.razorpay_payment_id,
        "razorpay_signature": data.razorpay_signature
    }

    try:
        razorpay_client.utility.verify_payment_signature(params_dict)
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Payment verification failed")

    # Save order in DB (optional)
    await database.orders.insert_one({
        "email": data.email or "guest",
        "order_id": data.razorpay_order_id,
        "payment_id": data.razorpay_payment_id,
        "status": "paid"
    })

    return {"success": True, "message": "Payment verified successfully"}
