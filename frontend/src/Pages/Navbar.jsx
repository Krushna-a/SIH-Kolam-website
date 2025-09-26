import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { cartItems, logout } = useContext(ShopContext);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`${
          visible ? "hidden" : ""
        } flex justify-between items-center bg-[#EDE1D8] shadow-md p-4 sticky top-0 z-50`}
      >
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-[#4C290C]">
          Kolam
        </NavLink>

        {/* Links */}
        <div className="hidden md:flex space-x-8 text-[#4C290C] font-semibold text-lg">
          <NavLink to="/" className="hover:text-[#A24C1D] transition-colors">
            Home
          </NavLink>
          <NavLink
            to="/collection"
            className="hover:text-[#A24C1D] transition-colors"
          >
            Collection
          </NavLink>
          <NavLink
            to="/kolam"
            className="hover:text-[#A24C1D] transition-colors"
          >
            Analyze Kolams
          </NavLink>
          <NavLink
            to="/about"
            className="hover:text-[#A24C1D] transition-colors"
          >
            About
          </NavLink>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5 relative">
          {/* Cart */}
          <NavLink to="/cart" className="relative">
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-[#4C290C] hover:text-[#A24C1D] cursor-pointer transition-colors"
            />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                {totalItems}
              </span>
            )}
          </NavLink>

          {/* User Dropdown */}
          <div className="relative group">
            <FontAwesomeIcon
              icon={faUser}
              className="text-[#4C290C] hover:text-[#A24C1D] cursor-pointer transition-colors"
            />
            <div className="hidden group-hover:flex flex-col absolute top-5 right-0 bg-[#F1E8E1] shadow-md rounded-xl p-3 w-32 text-[#4C290C]">
              <NavLink to="/api/auth" className="hover:text-[#A24C1D] mb-1">
                Login
              </NavLink>
              <NavLink to="/api/auth" className="hover:text-[#A24C1D] mb-1">
                Sign Up
              </NavLink>
              <p
                className="hover:text-[#A24C1D] cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </p>
            </div>
          </div>

          {/* Mobile toggle */}
          <div
            className="md:hidden cursor-pointer"
            onClick={() => setVisible(!visible)}
          >
            <FontAwesomeIcon icon={faSliders} className="text-[#4C290C]" />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-[#EDE1D8] z-50 transition-transform duration-300 ${
          visible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6">
          <FontAwesomeIcon
            icon={faXmark}
            className="text-[#4C290C] text-3xl cursor-pointer"
            onClick={() => setVisible(false)}
          />
        </div>
        <div className="flex flex-col items-center mt-10 gap-8 text-xl font-semibold text-[#4C290C]">
          <NavLink
            to="/"
            onClick={() => setVisible(false)}
            className="hover:text-[#A24C1D] transition-colors"
          >
            Home
          </NavLink>
          <NavLink
            to="/collection"
            onClick={() => setVisible(false)}
            className="hover:text-[#A24C1D] transition-colors"
          >
            Collection
          </NavLink>
          <NavLink
            to="/kolam"
            onClick={() => setVisible(false)}
            className="hover:text-[#A24C1D] transition-colors"
          >
            Analyze Kolams
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setVisible(false)}
            className="hover:text-[#A24C1D] transition-colors"
          >
            About
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;
