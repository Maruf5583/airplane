import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHero({ icon: Icon, eyebrow, title, subtitle, breadcrumb, bgImage }) {
  return (
    <section
      className="relative pt-16 pb-16 sm:pb-20 px-4 bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage || '/Images/sky02.jpg'}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white" />

      <div className="max-w-5xl mx-auto relative z-10">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-white/70 mb-4 animate-fade-up">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white/90">{breadcrumb}</span>
          </div>
        )}

        {eyebrow && (
          <span className="inline-flex items-center gap-2 bg-gold/90 text-emerald-dark text-xs font-semibold px-3 py-1.5 rounded-full animate-fade-up [animation-delay:80ms]">
            {Icon && <Icon size={14} />} {eyebrow}
          </span>
        )}

        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white mt-4 max-w-xl leading-tight animate-fade-up [animation-delay:160ms]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/80 text-sm sm:text-base mt-3 max-w-lg animate-fade-up [animation-delay:240ms]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}