import React from 'react';
import { Link, NavLink } from 'react-router';
import { FaUpload, FaHome, FaUserAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between py-3">
        
        {/* Bigger Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/assets/snap-vault.png" 
            alt="SnapVault Logo" 
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <ul className="menu menu-horizontal px-1 gap-4 text-sm font-medium hidden md:flex">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 border-b-2 border-blue-500 pb-1 flex items-center gap-1"
                  : "text-gray-600 hover:text-blue-400 flex items-center gap-1"
              }
            >
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 border-b-2 border-blue-500 pb-1 flex items-center gap-1"
                  : "text-gray-600 hover:text-blue-400 flex items-center gap-1"
              }
            >
              <FaUpload /> Upload
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mymedia"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 border-b-2 border-blue-500 pb-1 flex items-center gap-1"
                  : "text-gray-600 hover:text-blue-400 flex items-center gap-1"
              }
            >
              <FaUserAlt /> My Uploads
            </NavLink>
          </li>
        </ul>

        {/* Login Button */}
        <div className="flex items-center">
          <Link to="/login" className="btn px-6 py-1 rounded-xl text-white bg-blue-500 hover:bg-blue-700 btn-outline  border-blue-500">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
