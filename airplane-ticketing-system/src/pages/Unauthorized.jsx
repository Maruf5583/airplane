import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={28} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-500 text-sm mb-6">
          You don't have permission to view this page.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Go Home
        </Link>
      </div>
    </div>
  );
}