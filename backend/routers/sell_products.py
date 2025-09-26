from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import List
from bson import ObjectId
from db import products_collection
from schemas import ProductOut
from utils.auth import get_current_user
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

router = APIRouter(prefix="/api/products", tags=["Products"])

# Get seller's products
@router.get("/me", response_model=List[ProductOut])
async def get_my_products(current_user=Depends(get_current_user)):
    products = await products_collection.find({"seller": current_user["id"]}).to_list(100)
    return [
        ProductOut(
            id=str(p["_id"]),
            name=p["name"],
            category=p["category"],
            price=p["price"],
            description=p["description"],
            image=p["image"],
            seller=p["seller"]
        ) for p in products
    ]

# Add product
@router.post("/", response_model=ProductOut)
async def add_product(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    try:
        upload_result = cloudinary.uploader.upload(image.file, folder="kolam_products")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image upload failed: {e}")

    product = {
        "name": name,
        "category": category,
        "price": price,
        "description": description,
        "image": upload_result["secure_url"],
        "seller": current_user["id"]
    }

    result = await products_collection.insert_one(product)
    product["id"] = str(result.inserted_id)
    return ProductOut(**product)

# Update product
@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    name: str = Form(None),
    category: str = Form(None),
    price: float = Form(None),
    description: str = Form(None),
    image: UploadFile = File(None),
    current_user=Depends(get_current_user)
):
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product["seller"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    update_data = {}
    if name: update_data["name"] = name
    if category: update_data["category"] = category
    if price is not None: update_data["price"] = price
    if description: update_data["description"] = description
    if image:
        try:
            upload_result = cloudinary.uploader.upload(image.file, folder="kolam_products")
            update_data["image"] = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image upload failed: {e}")

    if update_data:
        await products_collection.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
        product.update(update_data)

    return ProductOut(
        id=str(product["_id"]),
        name=product["name"],
        category=product["category"],
        price=product["price"],
        description=product["description"],
        image=product["image"],
        seller=product["seller"]
    )

# Delete product
@router.delete("/{product_id}")
async def delete_product(product_id: str, current_user=Depends(get_current_user)):
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product["seller"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    await products_collection.delete_one({"_id": ObjectId(product_id)})
    return {"message": "Product deleted successfully"}
