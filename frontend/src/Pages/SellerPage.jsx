import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Pots",
    price: "",
    description: "",
    image: null,
    imagePreview: ""
  });
  const [editId, setEditId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://kolam-backend-7oou.onrender.com/api/products";

  // Get JWT token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return {};
    }
    return { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    };
  };

  // Check authentication
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return false;
    }
    return true;
  };

  // Fetch seller's products
  const fetchProducts = async () => {
    if (!checkAuth()) return;

    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to fetch products");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      image: file 
    }));
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ 
        ...prev, 
        imagePreview: reader.result 
      }));
    };
    reader.readAsDataURL(file);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      category: "Pots",
      price: "",
      description: "",
      image: null,
      imagePreview: ""
    });
    setEditId(null);
    setError("");
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkAuth()) return;

    if (!formData.name || !formData.price || !formData.description) {
      setError("Please fill all required fields");
      return;
    }

    if (!editId && !formData.image) {
      setError("Please select an image for the product");
      return;
    }

    setLoading(true);
    setError("");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("category", formData.category);
    payload.append("price", formData.price.toString());
    payload.append("description", formData.description);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload, {
          headers: getAuthHeaders()
        });
      } else {
        await axios.post(`${API_URL}/`, payload, {
          headers: getAuthHeaders()
        });
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.detail || "Something went wrong");
      
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      image: null,
      imagePreview: product.image
    });
    setEditId(product.id);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!checkAuth()) return;

    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.response?.data?.detail || "Failed to delete product");
      
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="p-6 text-center">
        <p>Please login to access seller dashboard</p>
        <button 
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Seller Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Product Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pots">Pots</option>
                <option value="Bedsheets">Bedsheets</option>
                <option value="Clothes">Clothes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editId ? "Product Image (Leave empty to keep current)" : "Product Image *"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            />
          </div>

          {formData.imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Preview
              </label>
              <img 
                src={formData.imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
            </button>
            
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Products</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products yet. Add your first product above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1 capitalize">{product.category}</p>
                  <p className="text-green-600 font-semibold mb-2">₹{product.price}</p>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;