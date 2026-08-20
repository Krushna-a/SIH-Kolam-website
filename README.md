# Kolam E-commerce Platform

A full-stack e-commerce platform for buying and selling traditional Kolam artwork with an AI-powered Kolam design generator.

## 🔗 Live Demo

- **Website**: https://sih-kolam-website.vercel.app
- **Demo Video**: [Watch here](https://github.com/user-attachments/assets/a8f76985-3ead-487a-8a18-551aee123d2f)

## 📋 About

Kolam E-commerce Platform is a specialized marketplace that preserves and promotes traditional Kolam art. The platform enables artists to sell their work and buyers to purchase authentic Kolam designs. It includes an AI-powered generator for creating custom Kolam patterns.

## ✨ Features

### Shopping Experience
- Browse Kolam products with category filters
- Shopping cart with real-time updates
- Secure checkout process
- Razorpay payment integration
- Order history and tracking

### Seller Features
- Product listing management
- Upload Kolam artwork
- Manage inventory
- Track sales

### AI Kolam Generator
- Generate custom Kolam designs using AI
- Download generated patterns
- Save designs to gallery

### User Management
- User authentication with JWT
- Profile management
- Order history
- Wishlist functionality

## 🛠️ Tech Stack

**Backend**
- FastAPI (Python)
- MongoDB (Motor async driver)
- JWT Authentication
- Razorpay Payment Gateway
- Cloudinary (Image Storage)
- Uvicorn (ASGI Server)

**Frontend**
- React 19
- Vite
- Tailwind CSS
- React Router v7
- Axios
- React Toastify

**AI/ML**
- Custom Kolam Generation Model
- Matplotlib (Pattern Visualization)
- NumPy

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js v18+
- MongoDB database
- Razorpay account
- Cloudinary account

### Backend Setup

**1. Navigate to backend**
```bash
cd backend
```

**2. Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Create `.env` file**
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**5. Start server**
```bash
uvicorn main:app --reload
```
Backend runs at: http://localhost:8000

### Frontend Setup

**1. Navigate to frontend**
```bash
cd frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```env
VITE_API_URL=http://localhost:8000
```

**4. Start development server**
```bash
npm run dev
```
Frontend runs at: http://localhost:5173

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)
*Landing page with featured Kolam designs*

### Product Catalog
![Products](./screenshots/products.png)
*Browse Kolam artwork with filters*

### AI Kolam Generator
![Generator](./screenshots/generator.png)
*Create custom Kolam patterns with AI*

### Shopping Cart
![Cart](./screenshots/cart.png)
*Cart management and checkout*

### Seller Dashboard
![Seller](./screenshots/seller-dashboard.png)
*Seller product management interface*

### User Profile
![Profile](./screenshots/profile.png)
*User profile and order history*

> **Note:** To add screenshots, create a `screenshots` folder in the project root and add images with the names shown above.

## 📡 API Documentation

### Authentication
```
POST   /api/users/register     - Register new user
POST   /api/users/login        - User login
GET    /api/users/me           - Get current user
```

### Products
```
GET    /api/products           - List all products
GET    /api/products/{id}      - Get product details
POST   /api/products           - Create product (seller)
PUT    /api/products/{id}      - Update product
DELETE /api/products/{id}      - Delete product
```

### Cart & Checkout
```
GET    /api/cart               - Get user cart
POST   /api/cart               - Add item to cart
DELETE /api/cart/{id}          - Remove from cart
POST   /api/checkout           - Process checkout
```

### Payments
```
POST   /api/payment/create     - Create payment order
POST   /api/payment/verify     - Verify payment
```

### Kolam Generator
```
POST   /api/kolam/generate     - Generate Kolam pattern
GET    /api/kolam/gallery      - Get generated designs
```

### Seller
```
POST   /api/sell/products      - List product for sale
GET    /api/sell/orders        - Get seller orders
PUT    /api/sell/products/{id} - Update listing
```

## 📂 Project Structure

```
SIH-Kolam-website/
├── backend/
│   ├── routers/
│   │   ├── users.py           # User authentication
│   │   ├── products.py        # Product management
│   │   ├── cart.py            # Shopping cart
│   │   ├── checkout.py        # Order processing
│   │   ├── payment_router.py  # Payment gateway
│   │   ├── kolam_generator.py # AI generator
│   │   └── sell_products.py   # Seller operations
│   ├── utils/                 # Helper functions
│   ├── main.py                # FastAPI app
│   ├── db.py                  # Database config
│   ├── schemas.py             # Pydantic models
│   └── requirements.txt       # Python dependencies
│
└── frontend/
    └── src/
        ├── components/        # React components
        ├── pages/            # Page views
        └── utils/            # Helper functions
```

## 🎨 AI Kolam Generator

The platform features a custom AI model that generates traditional Kolam patterns based on user preferences:

- Symmetry patterns
- Color schemes
- Complexity levels
- Traditional motifs

Generated designs can be downloaded or saved to the user's gallery.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

This project was developed as part of Smart India Hackathon (SIH).

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for preserving traditional Kolam art**
