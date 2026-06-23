import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Plane,
} from 'lucide-react';
import { useAuth, useLogout } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/agent/create-booking', label: 'Create Booking', icon: PlusCircle },
  { to: '/agent/bookings', label: 'Manage Bookings', icon: Ticket },
];

export default function AgentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Plane size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">SkyBook</span>
            <span className="hidden sm:inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full ml-2">
              Agent Portal
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-primary-700 bg-primary-50' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-50"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {user?.fullName}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-soft border border-slate-100 py-1.5 z-40">
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

          <button className="md:hidden text-slate-500" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

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
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'text-primary-700 bg-primary-50' : 'text-slate-600'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            <hr className="my-3 border-slate-100" />
            <button
              onClick={() => {
                setMobileOpen(false);
                logout.mutate();
              }}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 text-left"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}