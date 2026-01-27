
import logoo from "../../assets/logoo.svg";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-[#050B2C] via-[#07163D] to-[#081F4F] text-slate-300">
      <div className="container mx-auto px-6 py-16">
        {/* Top Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
          
       
          <div className="flex flex-col items-center lg:items-start">
            <img
              src={logoo}
              alt="AdPortal"
              className="mx-auto lg:mx-0"
            />
            <p className="lg:mt-0 mt-4 text-sm text-slate-400 max-w-xs">
              The universal ad management platform powered by AI
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/features" className="hover:text-white">
                  Features
                </a>
              </li>

              <li>
                <a href="/pricing" className="hover:text-white">
                  Pricing
                </a>
              </li>

          
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/about-us" className="hover:text-white">
                  About
                </a>
              </li>
            
              <li>
                <a href="/contact-us" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/privacy-policy" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms-and-conditions" className="hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="/security" className="hover:text-white">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          © 2026 AdPortal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
