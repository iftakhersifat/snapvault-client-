import React, { useContext, useState } from 'react';
import { NavLink, Link } from 'react-router';
import { FaBars, FaTimes, FaHome, FaUpload, FaUserAlt, FaImages, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../Firebase/AuthProvider';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logOut()
      .then(() => toast.success("Logged out successfully"))
      .catch(error => toast.error(error.message));
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Navigation items
  const navItems = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    // { to: '/gallery', label: 'SnapGallery', icon: <FaImages /> },
  ];

  if (user) {
    navItems.splice(1, 0,
      { to: '/upload', label: 'Upload', icon: <FaUpload /> },
      { to: '/mymedia', label: 'My Uploads', icon: <FaUserAlt /> },
      { to: '/profile', label: 'My Profile', icon: <FaUserCircle /> }
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/snap-vault.png" alt="SnapVault Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1 flex items-center gap-1"
                  : "hover:text-blue-500 transition flex items-center gap-1"
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Avatar / Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="cursor-pointer">
                <div className="avatar">
                  <div className="w-10 rounded-full border border-gray-300">
                    <img src={user?.photoURL || "/assets/user.png"} alt="User" />
                  </div>
                </div>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44 mt-3 z-[99]">
                <li><span className="text-gray-600">{user.displayName || 'User'}</span></li>
                <li><button onClick={handleLogout} className="text-red-500">Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <img src="/assets/user.png" className="w-10 rounded-full border border-gray-300" alt="Guest" />
              <Link
                to="/login"
                className="btn btn-sm bg-gradient-to-b from-blue-500 to-blue-700 text-white px-5"
              >
                Login
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="md:hidden text-2xl text-gray-700 ml-2">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t shadow-sm">
          <ul className="flex flex-col space-y-2 py-3 px-4">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold flex items-center gap-2"
                    : "text-gray-700 hover:text-blue-500 flex items-center gap-2"
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
