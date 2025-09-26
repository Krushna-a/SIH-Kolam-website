from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from typing import List, Optional
from db import products_collection
from schemas import ProductCreate, ProductUpdate, ProductOut, UserOut
from utils.auth import get_current_user
from bson import ObjectId
from datetime import datetime
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

router = APIRouter(prefix="/api/products", tags=["products"])

# Get all products (marketplace)
@router.get("/", response_model=List[ProductOut])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    products = []
    async for product in products_collection.find(query):
        products.append(ProductOut(
            id=str(product["_id"]),
            name=product["name"],
            description=product.get("description", ""),
            price=product["price"],
            category=product["category"],
            image=product["image"],
            seller=product["seller"]
        ))
    return products

# Get seller's products
@router.get("/me", response_model=List[ProductOut])
async def get_my_products(current_user: UserOut = Depends(get_current_user)):
    products = []
    async for product in products_collection.find({"seller": current_user.id}):
        products.append(ProductOut(
            id=str(product["_id"]),
            name=product["name"],
            description=product.get("description", ""),
            price=product["price"],
            category=product["category"],
            image=product["image"],
            seller=product["seller"]
        ))
    return products

# Get single product
@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return ProductOut(
        id=str(product["_id"]),
        name=product["name"],
        description=product.get("description", ""),
        price=product["price"],
        category=product["category"],
        image=product["image"],
        seller=product["seller"]
    )

# Add product with image upload
@router.post("/", response_model=ProductOut)
async def add_product(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    current_user: UserOut = Depends(get_current_user)
):
    try:
        # Upload image to Cloudinary
        upload_result = cloudinary.uploader.upload(
            image.file, 
            folder="kolam_products"
        )
        image_url = upload_result["secure_url"]
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Image upload failed: {str(e)}"
        )

    product_data = {
        "name": name,
        "category": category,
        "price": price,
        "description": description,
        "image": image_url,
        "seller": current_user.id,  # Store user ID as seller
        "seller_name": current_user.fullname,
        "created_at": datetime.utcnow()
    }

    result = await products_collection.insert_one(product_data)
    new_product = await products_collection.find_one({"_id": result.inserted_id})
    
    return ProductOut(
        id=str(new_product["_id"]),
        name=new_product["name"],
        description=new_product["description"],
        price=new_product["price"],
        category=new_product["category"],
        image=new_product["image"],
        seller=new_product["seller_name"]
    )

# Update product
@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    name: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: UserOut = Depends(get_current_user)
):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["seller"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")

    update_data = {}
    if name is not None:
        update_data["name"] = name
    if category is not None:
        update_data["category"] = category
    if price is not None:
        update_data["price"] = price
    if description is not None:
        update_data["description"] = description

    # Handle image update
    if image:
        try:
            upload_result = cloudinary.uploader.upload(
                image.file, 
                folder="kolam_products"
            )
            update_data["image"] = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Image upload failed: {str(e)}"
            )

    if update_data:
        await products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )

    updated_product = await products_collection.find_one({"_id": ObjectId(product_id)})
    return ProductOut(
        id=str(updated_product["_id"]),
        name=updated_product["name"],
        description=updated_product["description"],
        price=updated_product["price"],
        category=updated_product["category"],
        image=updated_product["image"],
        seller=updated_product["seller_name"]
    )

# Delete product
@router.delete("/{product_id}")
async def delete_product(
    product_id: str, 
    current_user: UserOut = Depends(get_current_user)
):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["seller"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")

    await products_collection.delete_one({"_id": ObjectId(product_id)})
    return {"message": "Product deleted successfully"}