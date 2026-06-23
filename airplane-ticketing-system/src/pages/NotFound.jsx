import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
          <Plane size={28} className="text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
        <p className="text-slate-500 text-sm mb-6">
          This page took a wrong turn and never landed.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Back to Home
        </Link>
      </div>
    </div>
  );
}