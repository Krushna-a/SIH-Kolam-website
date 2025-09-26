import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// import kolamImg from "../assets/kolam.png";
import kolam2 from "../assets/kolam3.png";
import { toast } from "react-toastify";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register, user } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await login(email, password);
        if (result.success) {
          toast.success("Login Successful!");
        } else {
          toast.error(result.error || "Invalid credentials");
          // yaha par ek bug h - toast notification less than a sec ke liye aata h and gayab ho jata h
        }
      } else {
        result = await register(fullname, email, password);
        if (result.success) {
          toast.success("Registration Successful!");
          // Auto-login
          const loginResult = await login(email, password);
          if (loginResult.success) {
            toast.success("Logged in automatically!");
          } else {
            toast.error(loginResult.error || "Auto-login failed");
          }
        } else {
          toast.error(result.error || "Registration failed");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex flex-col lg:flex-row h-screen bg-[#eee2d9] items-center justify-center">
        <div className="w-full max-w-md border-2 border-gray-300 rounded-xl p-6 bg-[#eee2d9] shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Hello, {user.fullname}</h2>
          <p className="mb-2">Email: {user.email}</p>
          <p className="text-green-600 mb-4">You are successfully logged in!</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-[#A24C1D] text-white py-2 rounded hover:scale-105 transition-transform"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#eee2d9]">
      {/* Left Kolam Image */}
      <div className="lg:w-1/2 hidden lg:flex justify-center items-center bg-[#eee2d9]">
        <img
          src={kolam2}
          alt="kolam background"
          className="w-full h-auto max-h-[600px] object-cover"
        />
      </div>

      {/* <img
        src={kolamImg}
        alt=""
        className="absolute block md:hidden h-1/4 top-[370px] right-[416px] z-0"
      /> */}

      {/* Auth Form */}
      <div className="lg:w-1/2 flex justify-center items-center p-6 relative">
        <div className="w-full max-w-md border-2 border-gray-300 p-6 bg-[#eee2d9] shadow-lg relative z-10">
          <h1 className="text-2xl font-semibold text-center mb-4">
            {isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="fullname" className="block mb-1 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Enter Your Full Name"
                  className="w-full rounded p-2 bg-gray-200 outline-none border-b-2 border-gray-400 text-sm"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-1 text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="w-full rounded p-2 bg-gray-200 outline-none border-b-2 border-gray-400 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="w-full rounded p-2 bg-gray-200 outline-none border-b-2 border-gray-400 text-sm"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center gap-2 my-3 w-full">
            <hr className="flex-1 border-gray-400" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-1 border-gray-400" />
          </div>

          <button
            type="button"
            className="w-full border-2 border-gray-300 rounded py-2 flex justify-center items-center gap-2 text-sm hover:scale-105 transition-transform"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-red-600" />
            {isLogin ? "Sign In with Google" : "Sign Up with Google"}
          </button>

          <p
            className="mt-3 text-center text-blue-600 font-semibold text-sm cursor-pointer hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Sign In"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
