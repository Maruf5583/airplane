import { Link } from 'react-router-dom';
import { Plane, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white mt-12">
      {/* Top accent line */}
      
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 sm:grid-cols-5 gap-10 text-sm">
        {/* Brand column */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-200">
              <Plane size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-base">SkyBook</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Book flights to 120+ destinations worldwide with the best prices and 24/7 support.
          </p>

          <div className="space-y-2 text-xs text-slate-500 mb-4">
            <a href="mailto:support@skybook.com" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
              <Mail size={13} className="text-slate-400" />
              support@skybook.com
            </a>
            <a href="tel:+18000000000" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
              <Phone size={13} className="text-slate-400" />
              +1 (800) 000-0000
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={13} className="text-slate-400" />
              Dhaka, Bangladesh
            </span>
          </div>

          <div className="flex gap-2">
            
             <a href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Facebook size={15} />
            </a>

            
             <a href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Twitter size={15} />
            </a>

            
             <a href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Instagram size={15} />
            </a>
          </div>
        </div>

        <div>
          <div className="font-semibold text-slate-800 mb-3">Company</div>
          <nav className="flex flex-col gap-1">
            <Link to="/about" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">About Us</Link>
            <Link to="/careers" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Careers</Link>
            <Link to="/contact" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Contact</Link>
          </nav>
        </div>

        <div>
          <div className="font-semibold text-slate-800 mb-3">Explore</div>
          <nav className="flex flex-col gap-1">
            <Link to="/destinations" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Destinations</Link>
            <Link to="/offers" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Offers</Link>
            <Link to="/" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Search Flights</Link>
          </nav>
        </div>

        <div>
          <div className="font-semibold text-slate-800 mb-3">Support</div>
          <nav className="flex flex-col gap-1">
            <Link to="/support/help-center" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Help Center</Link>
            <Link to="/support/manage-booking" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Manage Booking</Link>
            <Link to="/support/faq" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">FAQ</Link>
          </nav>
        </div>

        <div>
          <div className="font-semibold text-slate-800 mb-3">Legal</div>
          <nav className="flex flex-col gap-1">
            <Link to="/legal/terms-of-service" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Terms of Service</Link>
            <Link to="/legal/privacy-policy" className="text-slate-500 py-1 hover:text-primary-600 hover:translate-x-0.5 transition-all w-fit">Privacy Policy</Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} SkyBook. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Made with <span className="text-primary-600">♥</span> for travelers everywhere
        </span>
      </div>
    </footer>
  );
}