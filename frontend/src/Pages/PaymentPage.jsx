import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const PaymentPage = () => {
  const { cartItems, setCartItems } = useContext(ShopContext);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  const discount = 0.1;
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * (1 - discount) * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (totalAmount === 0) return;
    setLoading(true);
    setStatus("");
    try {
      console.log("Creating Razorpay order for amount:", totalAmount);

      const orderResponse = await axios.post(
        "https://kolam-backend-7oou.onrender.com/api/payment/create-order",
        { amount: Math.round(totalAmount * 100), email: guestEmail },
        { withCredentials: true }
      );

      const { id: order_id, amount, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_RLrxZbic8zigbH",
        amount,
        currency,
        name: "Kolam Studio",
        description: "Purchase from Kolam Studio",
        order_id,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              "https://kolam-backend-7oou.onrender.com/api/payment/verify-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                email: guestEmail,
              }
            );

            if (verificationResponse.data.success) {
              setStatus("success");
              setCartItems([]);
            } else {
              setStatus("failed");
            }
          } catch (error) {
            setStatus("failed");
          }
        },
        prefill: { name: "Guest", email: guestEmail, contact: "9999999999" },
        theme: { color: "#F37254" },
        modal: {
          ondismiss: () => {
            setStatus("cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Checkout</h1>

      <input
        type="email"
        placeholder="Your email (optional)"
        value={guestEmail}
        onChange={(e) => setGuestEmail(e.target.value)}
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <div className="w-full flex justify-between items-center mb-6">
        <p className="text-lg font-semibold text-gray-700">Total:</p>
        <p className="text-lg font-bold text-gray-900">₹{totalAmount.toFixed(2)}</p>
      </div>

      <button
        disabled={loading || totalAmount === 0}
        onClick={handlePayment}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-300 mb-3 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {status && (
        <div className="mt-4 text-center w-full">
          {status === "success" && <p className="text-green-600 font-medium">Payment Successful!</p>}
          {status === "failed" && <p className="text-red-600 font-medium">Payment Failed!</p>}
          {status === "cancelled" && <p className="text-yellow-600 font-medium">Payment Cancelled.</p>}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
