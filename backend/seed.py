import asyncio
from db import db
from utils.auth import get_password_hash

async def seed():
    # --- Clear all collections ---
    await db.users.delete_many({})
    await db.products.delete_many({})
    await db.carts.delete_many({})

    # --- Test user ---
    test_user = {
        "fullname": "Test User",
        "email": "test@example.com",
        "password": get_password_hash("password123")
    }
    await db.users.insert_one(test_user)

    # --- Products ---
    products = [
        {
            "name": "Kolam Printed Clay Pot",
            "category": "Pots",
            "price": 1200,
            "image": "https://www.mudfingers.com/cdn/shop/products/01_cd5010ff-add4-4027-915e-dbe588fca354_1200x1600.jpg?v=1609993530",
            "desc": "Handcrafted clay pot with traditional Kolam design, perfect for home décor.",
            "seller": "MudFingers Artisans"
        },
        {
            "name": "Kolam Wall Hanging",
            "category": "Decor",
            "price": 800,
            "image": "https://example.com/wall-hanging.jpg",
            "desc": "Traditional Kolam pattern wall hanging for home decoration.",
            "seller": "MudFingers Artisans"
        }
    ]

    for p in products:
        await db.products.insert_one(p)

    print("DB cleared and seeded successfully.")

asyncio.run(seed())
