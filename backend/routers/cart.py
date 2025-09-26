from fastapi import APIRouter, HTTPException, status, Depends
from db import cart_collection, products_collection
from schemas import CartItemCreate, CartOut, UserOut
from utils.auth import get_current_user
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/cart", tags=["cart"])

# Add this new schema for update request
class UpdateQuantityRequest(BaseModel):
    quantity: int

@router.get("/", response_model=CartOut)
async def get_cart(current_user: UserOut = Depends(get_current_user)):
    cart = await cart_collection.find_one({"user_id": current_user.id})
    
    if not cart:
        return CartOut(user_id=current_user.id, items=[], total_price=0)
    
    items_with_details = []
    total_price = 0
    
    for item in cart.get("items", []):
        if not ObjectId.is_valid(item["product_id"]):
            continue
            
        product = await products_collection.find_one({"_id": ObjectId(item["product_id"])})
        if product:
            item_total = product["price"] * item["quantity"]
            total_price += item_total
            
            items_with_details.append({
                "product_id": item["product_id"],
                "name": product["name"],
                "price": product["price"],
                "image": product["image"],
                "seller": product["seller"],
                "quantity": item["quantity"]
            })
    
    return CartOut(user_id=current_user.id, items=items_with_details, total_price=total_price)

@router.post("/add", response_model=CartOut)
async def add_to_cart(cart_item: CartItemCreate, current_user: UserOut = Depends(get_current_user)):
    # Verify product exists
    if not ObjectId.is_valid(cart_item.product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    product = await products_collection.find_one({"_id": ObjectId(cart_item.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get or create cart for user
    cart = await cart_collection.find_one({"user_id": current_user.id})
    
    if not cart:
        # Create new cart
        cart_data = {
            "user_id": current_user.id,
            "items": [{"product_id": cart_item.product_id, "quantity": cart_item.quantity}],
            "updated_at": datetime.utcnow()
        }
        await cart_collection.insert_one(cart_data)
    else:
        # Update existing cart
        existing_item = None
        for item in cart.get("items", []):
            if item["product_id"] == cart_item.product_id:
                existing_item = item
                break
        
        if existing_item:
            # Update quantity
            await cart_collection.update_one(
                {"user_id": current_user.id, "items.product_id": cart_item.product_id},
                {"$inc": {"items.$.quantity": cart_item.quantity}}
            )
        else:
            # Add new item
            await cart_collection.update_one(
                {"user_id": current_user.id},
                {"$push": {"items": {"product_id": cart_item.product_id, "quantity": cart_item.quantity}}}
            )
    
    return await get_cart(current_user)

@router.put("/update/{product_id}", response_model=CartOut)
async def update_cart_item(
    product_id: str, 
    request: UpdateQuantityRequest,  # Changed to accept request body
    current_user: UserOut = Depends(get_current_user)
):
    quantity = request.quantity  # Extract quantity from request body
    
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")
    
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    # Check if item exists in cart
    cart = await cart_collection.find_one({
        "user_id": current_user.id,
        "items.product_id": product_id
    })
    
    if not cart:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    # Update quantity
    await cart_collection.update_one(
        {"user_id": current_user.id, "items.product_id": product_id},
        {"$set": {"items.$.quantity": quantity}}
    )
    
    return await get_cart(current_user)

@router.delete("/remove/{product_id}", response_model=CartOut)
async def remove_from_cart(product_id: str, current_user: UserOut = Depends(get_current_user)):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    # Remove item from cart
    await cart_collection.update_one(
        {"user_id": current_user.id},
        {"$pull": {"items": {"product_id": product_id}}}
    )
    
    return await get_cart(current_user)

@router.delete("/clear")
async def clear_cart(current_user: UserOut = Depends(get_current_user)):
    await cart_collection.update_one(
        {"user_id": current_user.id},
        {"$set": {"items": []}}
    )
    
    return {"message": "Cart cleared successfully"}