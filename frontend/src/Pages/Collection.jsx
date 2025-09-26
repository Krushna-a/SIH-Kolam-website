import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Collection = () => {
  const { products, addToCart, user } = useContext(ShopContext);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = ["Pots", "Bedsheets", "Clothes"];
  const discount = 0.1;

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart. Try again.");
    }
  };

  return (
    <div className="bg-[#EDE1D8] min-h-screen font-sans text-[#4C290C] p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Kolam Collection</h1>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 bg-[#F1E8E1] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="w-5 h-5 accent-[#A24C1D]"
              />
              <span>{category}</span>
            </label>
          ))}
          <div className="w-full h-[1.5px] bg-gray-400 my-6"></div>
          <div className="bg-[#F1E8E1] p-4 rounded-xl shadow-md">
            <h3 className="font-semibold text-lg mb-2">Sell Your Kolam Items</h3>
            <p className="text-sm text-gray-600 mb-3">
              Are you an artisan or want to sell kolam printed products? Click below to start selling.
            </p>
            <Link
              to="/sell"
              className="block bg-[#A24C1D] text-white text-center py-2 px-4 rounded hover:bg-[#872f0c] transition"
            >
              Start Selling
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 flex flex-col gap-6">
          {/* Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-3 rounded-xl border border-[#A24C1D] w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#A24C1D]"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const discountedPrice = Math.round(product.price * (1 - discount));
                return (
                  <div
                    key={product.id}
                    className="bg-[#F1E8E1] shadow-md hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col"
                  >
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover"
                      />
                    </Link>
                    <div className="p-4 flex flex-col flex-1">
                      <h2 className="text-lg font-bold mb-1">{product.name}</h2>
                      <p className="text-sm text-gray-600 mb-2">{product.seller}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <p className="font-semibold text-[#4C290C] text-lg">₹{discountedPrice}</p>
                        <p className="text-gray-400 line-through text-sm">₹{product.price}</p>
                        <p className="text-red-500 text-sm">{discount * 100}% OFF</p>
                      </div>
                      <div className="mt-auto flex flex-col gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#A24C1D] text-white px-4 py-2 rounded hover:bg-[#872f0c] transition"
                        >
                          Add to Cart
                        </button>
                        <Link
                          to={`/product/${product.id}`}
                          className="text-[#A24C1D] font-semibold text-center hover:underline"
                        >
                          Click to Explore
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-[#4C290C] text-lg">No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
