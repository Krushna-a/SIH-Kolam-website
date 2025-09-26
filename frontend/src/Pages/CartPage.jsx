import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, user } = useContext(ShopContext);
  const navigate = useNavigate();
  const discount = 0.1;

  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity * (1 - discount),
    0
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EDE1D8] p-6">
        <h2 className="text-3xl font-bold mb-4">Please Login</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to view your cart.
        </p>
        <button
          onClick={() => navigate('/api/auth')}
          className="bg-[#A24C1D] text-white px-6 py-2 rounded hover:bg-[#872f0c]"
        >
          Login
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EDE1D8] p-6">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added anything yet.
        </p>
        <button
          onClick={() => navigate("/collection")}
          className="bg-[#A24C1D] text-white px-6 py-2 rounded hover:bg-[#872f0c]"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handleRemove = (productId) => {
    try {
      removeFromCart(productId);
      setConfirmRemoveId(null);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    try {
      updateQuantity(productId, newQty);
      toast.success("Quantity updated");
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE1D8] p-4 sm:p-6 md:p-8 font-sans text-[#4C290C]">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Your Cart
      </h1>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => {
            const discountedPrice = Math.round(item.price * (1 - discount));
            return (
              <div
                key={item.product_id}
                className="flex flex-col sm:flex-row items-center sm:items-start bg-[#F1E8E1] rounded-xl p-4 shadow-md gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-40 sm:w-28 h-40 sm:h-28 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 flex flex-col gap-2 w-full">
                  <h2 className="text-lg sm:text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">{item.seller}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                    <span className="font-semibold text-lg">₹{discountedPrice}</span>
                    <span className="text-gray-400 line-through">₹{item.price}</span>
                    <span className="text-red-500">{discount * 100}% OFF</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 bg-[#A24C1D] text-white rounded hover:bg-[#872f0c] disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border rounded">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                      className="px-3 py-1 bg-[#A24C1D] text-white rounded hover:bg-[#872f0c]"
                    >
                      +
                    </button>

                    {/* Remove with inline confirmation */}
                    {confirmRemoveId === item.product_id ? (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmRemoveId(null)}
                          className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRemoveId(item.product_id)}
                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 bg-[#F1E8E1] p-6 rounded-xl shadow-md flex flex-col gap-4 h-fit mt-6 lg:mt-0">
          <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
          <p className="flex justify-between text-lg">
            Items: <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </p>
          <p className="flex justify-between text-lg">Discount: <span>{discount * 100}%</span></p>
          <hr className="my-2" />
          <p className="flex justify-between font-semibold text-xl">
            Total: <span>₹{totalPrice.toFixed(2)}</span>
          </p>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-[#A24C1D] text-white px-6 py-2 rounded hover:bg-[#872f0c] mt-4"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
