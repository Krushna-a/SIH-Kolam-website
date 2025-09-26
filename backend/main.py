from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, products, cart, checkout, payment_router, kolam_generator, sell_products
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Kolam E-commerce API",
    description="Backend API for Kolam E-commerce Platform",
    version="1.0.0"
)

# CORS middleware - Fixed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(checkout.router)
app.include_router(payment_router.payment_router)
app.include_router(kolam_generator.router)
app.include_router(sell_products.router)

@app.get("/")
async def root():
    return {"message": "Kolam E-commerce Backend Running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)