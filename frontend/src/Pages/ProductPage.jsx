import React, { useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const ProductPage = () => {
  const { id } = useParams();
  const { products, addToCart, user } = useContext(ShopContext);
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4C290C] font-sans">
        <p>Product not found.</p>
      </div>
    );
  }

  const discount = 0.1;
  const discountedPrice = Math.round(product.price * (1 - discount));
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart!");
      return;
    }
    addToCart(product);
    toast.success("Product added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to buy products!");
      return;
    }
    addToCart(product);
    toast.success("Product added to cart! Redirecting to checkout...");
    navigate("/cart");
  };

  return (
    <div className="bg-[#EDE1D8] min-h-screen font-sans text-[#4C290C] p-6 flex flex-col items-center">
      <Link to="/collection" className="mb-4 text-[#A24C1D] hover:underline">
        ← Back to Collection
      </Link>

      <div className="max-w-4xl w-full bg-[#F1E8E1] p-6 shadow-md flex flex-col md:flex-row gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-[300px] md:h-[500px] object-contain md:object-cover"
        />
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-gray-600 mb-2">{product.seller}</p>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <p className="font-semibold text-[#4C290C] text-xl">
              ₹{discountedPrice}
            </p>
            <p className="text-gray-400 line-through text-sm">
              ₹{product.price}
            </p>
            <p className="text-red-500 text-sm">{discount * 100}% OFF</p>
          </div>
          <p className="w-full h-[1px] bg-gray-500"></p>
          <p className="mb-4">{product.desc}</p>

          <button
            onClick={handleAddToCart}
            className="bg-[#A24C1D] text-white px-4 py-2 hover:bg-[#872f0c] transition"
          >
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="bg-[#000] text-white px-4 py-2 hover:bg-[#fff] hover:text-[#000] transition mt-2"
          >
            Buy Now
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12 w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => {
              const relatedDiscountedPrice = Math.round(
                p.price * (1 - discount)
              );
              return (
                <Link to={`/product/${p.id}`} key={p._id}>
                  <div className="bg-[#F1E8E1] shadow-md hover:shadow-xl transition transform hover:-translate-y-2 border-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{p.seller}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <p className="font-semibold text-[#4C290C] text-lg">
                          ₹{relatedDiscountedPrice}
                        </p>
                        <p className="text-gray-400 line-through text-sm">
                          ₹{p.price}
                        </p>
                        <p className="text-red-500 text-sm">
                          {discount * 100}% OFF
                        </p>
                      </div>
                      <p className="text-[#A24C1D] font-semibold cursor-pointer hover:underline">
                        Click to Explore
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
