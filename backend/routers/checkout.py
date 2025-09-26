from fastapi import APIRouter, HTTPException, status, Depends
from db import cart_collection, orders_collection, products_collection
from schemas import OrderOut, OrderCreate, OrderItem, UserOut
from utils.auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/checkout", tags=["checkout"])


@router.post("/", response_model=OrderOut)
async def create_order(current_user: UserOut = Depends(get_current_user)):
    # Get user's cart
    cart = await cart_collection.find_one({"user_id": current_user.id})
    
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Prepare order items and calculate total
    order_items = []
    total_amount = 0
    
    for item in cart["items"]:
        product = await products_collection.find_one({"_id": ObjectId(item["product_id"])})
        if product:
            item_total = product["price"] * item["quantity"]
            total_amount += item_total
            
            order_items.append(OrderItem(
                product_id=item["product_id"],
                name=product["name"],
                price=product["price"],
                quantity=item["quantity"]
            ))
    
    # Create order
    order_data = {
        "user_id": current_user.id,
        "items": [item.dict() for item in order_items],
        "total_amount": total_amount,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    result = await orders_collection.insert_one(order_data)
    
    # Clear cart after successful order
    await cart_collection.update_one(
        {"user_id": current_user.id},
        {"$set": {"items": []}}
    )
    
    # Return created order
    new_order = await orders_collection.find_one({"_id": result.inserted_id})
    
    return OrderOut(
        id=str(new_order["_id"]),
        user_id=new_order["user_id"],
        items=[OrderItem(**item) for item in new_order["items"]],
        total_amount=new_order["total_amount"],
        status=new_order["status"],
        created_at=new_order["created_at"]
    )

@router.get("/orders", response_model=list[OrderOut])
async def get_user_orders(current_user: UserOut = Depends(get_current_user)):
    orders = []
    async for order in orders_collection.find({"user_id": current_user.id}).sort("created_at", -1):
        orders.append(OrderOut(
            id=str(order["_id"]),
            user_id=order["user_id"],
            items=[OrderItem(**item) for item in order["items"]],
            total_amount=order["total_amount"],
            status=order["status"],
            created_at=order["created_at"]
        ))
    
    return orders

@router.get("/orders/{order_id}", response_model=OrderOut)
async def get_order(order_id: str, current_user: UserOut = Depends(get_current_user)):
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order ID")
    
    order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    return OrderOut(
        id=str(order["_id"]),
        user_id=order["user_id"],
        items=[OrderItem(**item) for item in order["items"]],
        total_amount=order["total_amount"],
        status=order["status"],
        created_at=order["created_at"]
    )