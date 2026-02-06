import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/whiteLogo.svg";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/AuthThunks"; 
import { toast } from "sonner";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-[15px] font-medium transition-all ${
    isActive
      ? "bg-blue-600 text-white rounded-md"
      : "text-gray-700 hover:text-blue-600"
  }`;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

const handleLogout = async () => {
  try {
    await dispatch(logout()).unwrap();
  } finally {
    navigate("/auth/signin", { replace: true });
    toast.success("Logged out successfully!");
  }
};







  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="AdPortal Logo" className="h-14 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/features" className={navLinkClass}>
              Features
            </NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>
              How it Works
            </NavLink>
            <NavLink to="/pricing" className={navLinkClass}>
              Pricing
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/user-dashboard/dashboard"
                className={navLinkClass}
              >
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/auth/signin"
                  className="text-[15px] font-medium text-gray-700 hover:text-blue-600"
                >
                  Log In
                </Link>

                <Link
                  to="/auth/signin"
                  className="rounded-md bg-blue-600 px-4 py-2 h-12 flex items-center text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Start Free Trial
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600">
                  {user?.first_name}
                </span>

                <button
                  onClick={handleLogout}
                  className="rounded-md border px-4 py-2 text-sm cursor-pointer font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-2xl text-gray-700"
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-screen py-4" : "max-h-0"
        } bg-white border-t border-gray-200`}
      >
        <div className="px-6 flex flex-col space-y-2">
          <NavLink to="/" className={navLinkClass} onClick={handleLinkClick}>
            Home
          </NavLink>
          <NavLink
            to="/features"
            className={navLinkClass}
            onClick={handleLinkClick}
          >
            Features
          </NavLink>
          <NavLink
            to="/how-it-works"
            className={navLinkClass}
            onClick={handleLinkClick}
          >
            How it Works
          </NavLink>
          <NavLink
            to="/pricing"
            className={navLinkClass}
            onClick={handleLinkClick}
          >
            Pricing
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/user-dashboard/dashboard"
              className={navLinkClass}
              onClick={handleLinkClick}
            >
              Dashboard
            </NavLink>
          )}

          <div className="pt-4 border-t space-y-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/auth/signin"
                  onClick={handleLinkClick}
                  className="block text-gray-700 hover:text-blue-600"
                >
                  Log In
                </Link>

                <Link
                  to="/auth/signin"
                  onClick={handleLinkClick}
                  className="block text-center rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition"
                >
                  Start Free Trial
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  handleLinkClick();
                }}
                className="block w-full text-left rounded-md border px-3 cursor-pointer py-2 text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            )}
          </div>

          <Link
            to="/start-free-trial"
            onClick={handleLinkClick}
            className="block text-center rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
