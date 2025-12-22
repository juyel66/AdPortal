import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-blue-600 text-white rounded-md px-3 py-2"
    : "text-gray-700 hover:text-blue-600 px-3 py-2";

const Navbar = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
              alt="AdPortal Logo"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 text-[15px] font-medium">
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
            <NavLink
              to="/user-dashboard/dashboard"
              className={navLinkClass}
            >
              Dashboard
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/auth/signin"
              className="text-[15px] font-medium text-gray-700 hover:text-blue-600"
            >
              Log In
            </Link>

            <Link
              to="/start-free-trial"
              className="rounded-md bg-blue-600 px-4 py-2 h-12 flex items-center text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <label htmlFor="mobile-menu" className="cursor-pointer">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <input type="checkbox" id="mobile-menu" className="peer hidden" />

      <div className="md:hidden peer-checked:block hidden border-t border-gray-200 bg-white">
        <div className="px-6 py-4 space-y-2 text-[15px] font-medium">
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
          <NavLink
            to="/user-dashboard/dashboard"
            className={navLinkClass}
          >
            Dashboard
          </NavLink>

          <div className="pt-4 border-t space-y-3">
            <Link
              to="/auth/signin"
              className="block text-gray-700 hover:text-blue-600"
            >
              Log In
            </Link>

            <Link
              to="/start-free-trial"
              className="block text-center rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
