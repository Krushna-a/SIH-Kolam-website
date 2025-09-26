import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const discount = 0.1;

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if all fields are filled
    const allFilled = Object.values(form).every((val) => val.trim() !== "");
    if (!allFilled) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Proceeding to payment...");
    navigate("/payment");
  };

  if (cartItems.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4C290C] font-sans bg-[#EDE1D8]">
        <p className="text-xl">Your cart is empty.</p>
      </div>
    );

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Math.round(item.price * (1 - discount)) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#EDE1D8] p-6 flex flex-col items-center font-sans text-[#4C290C]">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Shipping Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col gap-4 sm:gap-6"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Shipping Information
          </h2>
          {[
            { name: "name", label: "Full Name" },
            { name: "email", label: "Email Address" },
            { name: "address", label: "Street Address" },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
            { name: "zip", label: "ZIP / Postal Code" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="mb-1 text-sm sm:text-base font-medium">
                {field.label}
              </label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A24C1D]"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-3 sm:mt-4 bg-[#A24C1D] text-white py-2 sm:py-3 rounded-xl hover:bg-[#872f0c] transition text-sm sm:text-lg font-semibold disabled:opacity-50"
            disabled={!Object.values(form).every((val) => val.trim() !== "")}
          >
            Proceed to Payment
          </button>
        </form>

        {/* Order Summary */}
        <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-4 h-fit">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item) => {
            const discountedPrice = Math.round(item.price * (1 - discount));
            return (
              <div
                key={item.product_id || item.id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{discountedPrice * item.quantity}</span>
              </div>
            );
          })}
          <hr className="my-2" />
          <p className="flex justify-between text-lg font-bold">
            Total: <span>₹{totalPrice}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
