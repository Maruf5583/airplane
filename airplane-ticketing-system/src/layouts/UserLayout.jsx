import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { Plane, Menu, X, User, ChevronDown, LogOut, Ticket, BookMarked } from 'lucide-react';
import { useAuth, useLogout } from '../hooks/useAuth';

const NAV_LINKS = [
  { to: '/', label: 'Search Flights' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/my-tickets', label: 'My Tickets' },
];

export default function UserLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Plane size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">SkyBook</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.fullName}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft border border-slate-100 py-1.5 z-40">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User size={15} /> My Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/my-bookings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <BookMarked size={15} /> My Bookings
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/my-tickets');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Ticket size={15} /> My Tickets
                      </button>
                      <hr className="my-1 border-slate-100" />
                      <button
                        onClick={() => logout.mutate()}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary !py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-slate-500" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-slate-800">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>

            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'text-primary-700 bg-primary-50' : 'text-slate-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <hr className="my-3 border-slate-100" />

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600"
                >
                  My Profile
                </NavLink>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout.mutate();
                  }}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} SkyBook. All rights reserved.
        </div>
      </footer>
    </div>
  );
}