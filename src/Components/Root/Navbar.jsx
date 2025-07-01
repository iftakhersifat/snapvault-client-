import React from 'react';
import { Link, NavLink } from 'react-router';
import { FaUpload, FaHome, FaUserAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-md ">

      <div className='container mx-auto px-4 flex justify-between'>
        <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">MediaShare</Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2 text-sm font-medium">
          <li>
            <NavLink to="/" className="flex items-center gap-1"><FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/upload" className="flex items-center gap-1">
              <FaUpload /> Upload
            </NavLink>
          </li>
          <li>
            <NavLink to="/mymedia" className="flex items-center gap-1" >
              <FaUserAlt /> My Uploads
            </NavLink>
          </li>
        </ul>

        <Link to="/login" className="btn btn-sm btn-primary ml-4">
          Login
        </Link>
      </div>
      </div>

    </div>
  );
};

export default Navbar;
