import { Plane } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute w-96 h-96 bg-white rounded-full -top-20 -left-20" />
          <div className="absolute w-72 h-72 bg-white rounded-full bottom-10 right-10" />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Plane size={20} />
            </div>
            <span className="font-bold text-2xl">SkyBook</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Fly smarter, book faster.
          </h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Search flights, manage bookings, and get your boarding pass —
            all in one place.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <Plane size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">SkyBook</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">{title}</h1>
          {subtitle && <p className="text-slate-500 text-sm mb-8">{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  );
}