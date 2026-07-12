import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Plane,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Ticket,
  BookMarked,
} from 'lucide-react';
import { useAuth, useLogout } from '../hooks/useAuth';
import Footer from './Footer';

// Simple, non-dropdown links
const PUBLIC_LINKS = [
  { to: '/', label: 'Flights' },
  { to: '/offers', label: 'Offers' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

// Dropdown-style nav groups (Support, Legal)
const DROPDOWN_LINKS = [
  {
    key: 'support',
    label: 'Support',
    items: [
      { to: '/support/help-center', label: 'Help Center' },
      { to: '/support/manage-booking', label: 'Manage Booking' },
      { to: '/support/faq', label: 'FAQ' },
    ],
  },
  {
    key: 'legal',
    label: 'Legal',
    items: [
      { to: '/legal/terms-of-service', label: 'Terms & Service' },
      { to: '/legal/privacy-policy', label: 'Privacy Policy' },
    ],
  },
];

const USER_LINKS = [
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/my-tickets', label: 'My Tickets' },
];

export default function UserLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'support' | 'legal' | null
  const [mobileGroupOpen, setMobileGroupOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const dropdownRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close an open desktop dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e) => {
      const ref = dropdownRefs.current[openDropdown];
      if (ref && !ref.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openDropdown]);

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 group ${
      isActive ? 'text-emerald' : 'text-slate-600 hover:text-emerald'
    }`;

  const NavUnderline = ({ isActive }) => (
    <span
      className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-emerald origin-center transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-soft border-b border-slate-100'
            : 'bg-white/40 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald flex items-center justify-center transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
              <Plane size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-slate-800 text-lg">SkyBook</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    <NavUnderline isActive={isActive} />
                  </>
                )}
              </NavLink>
            ))}

            {isAuthenticated &&
              USER_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <NavUnderline isActive={isActive} />
                    </>
                  )}
                </NavLink>
              ))}

            {/* Support / Legal dropdowns */}
            {DROPDOWN_LINKS.map((group) => {
              const isOpen = openDropdown === group.key;
              return (
                <div
                  key={group.key}
                  className="relative"
                  ref={(el) => (dropdownRefs.current[group.key] = el)}
                >
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : group.key)}
                    className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 group ${
                      isOpen ? 'text-emerald' : 'text-slate-600 hover:text-emerald'
                    }`}
                  >
                    {group.label}
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald' : ''
                      }`}
                    />
                    <span
                      className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-emerald origin-center transition-transform duration-300 ${
                        isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-soft border border-slate-100 py-1.5 z-40 animate-slide-down origin-top-left">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpenDropdown(null)}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? 'text-emerald bg-emerald/5'
                                : 'text-slate-600 hover:bg-emerald/5 hover:text-emerald'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald/10 text-emerald flex items-center justify-center text-sm font-semibold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.fullName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft border border-slate-100 py-1.5 z-40 animate-slide-down origin-top-right">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-emerald/5 hover:text-emerald transition-colors flex items-center gap-2"
                      >
                        <User size={15} /> My Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/my-bookings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-emerald/5 hover:text-emerald transition-colors flex items-center gap-2"
                      >
                        <BookMarked size={15} /> My Bookings
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/my-tickets');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-emerald/5 hover:text-emerald transition-colors flex items-center gap-2"
                      >
                        <Ticket size={15} /> My Tickets
                      </button>
                      <hr className="my-1 border-slate-100" />
                      <button
                        onClick={() => logout.mutate()}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-emerald border border-emerald/30 hover:bg-emerald/5 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald text-white shadow-sm hover:bg-emerald-dark hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-slate-500 hover:text-emerald transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 animate-fade-up [animation-duration:0.2s]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl p-5 flex flex-col gap-1 animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-slate-800">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 hover:text-emerald hover:rotate-90 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {PUBLIC_LINKS.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 animate-fade-up ${
                    isActive ? 'text-emerald bg-emerald/5' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
                style={{ animationDelay: `${i * 40}ms` }}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated &&
              USER_LINKS.map((link, i) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 animate-fade-up ${
                      isActive ? 'text-emerald bg-emerald/5' : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                  style={{ animationDelay: `${(PUBLIC_LINKS.length + i) * 40}ms` }}
                >
                  {link.label}
                </NavLink>
              ))}

            {/* Support / Legal accordion groups */}
            {DROPDOWN_LINKS.map((group) => {
              const isOpen = mobileGroupOpen === group.key;
              return (
                <div key={group.key} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setMobileGroupOpen(isOpen ? null : group.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isOpen ? 'text-emerald bg-emerald/5' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pl-6 flex flex-col gap-0.5 pt-1 pb-1 animate-fade-up [animation-duration:0.2s]">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileGroupOpen(null);
                          }}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive ? 'text-emerald bg-emerald/5' : 'text-slate-500 hover:bg-slate-50'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <hr className="my-3 border-slate-100" />

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  My Profile
                </NavLink>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout.mutate();
                  }}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 text-left hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-emerald border border-emerald/30 hover:bg-emerald/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald text-white hover:bg-emerald-dark transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}