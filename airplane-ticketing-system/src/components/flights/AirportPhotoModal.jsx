import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AirportPhotoModal({ isOpen, onClose, photos, currentIndex, onNavigate, airportCode, airportLabel }) {
  if (!isOpen || !photos || photos.length === 0) return null;

  const photo = photos[currentIndex];
  const hasMultiple = photos.length > 1;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md z-20 transition-colors"
        >
          <X size={18} />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => onNavigate(currentIndex === 0 ? photos.length - 1 : currentIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md z-20 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(currentIndex === photos.length - 1 ? 0 : currentIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md z-20 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <img src={photo.fullUrl} alt={airportCode} className="w-full max-h-[65vh] object-cover" />

        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">{airportLabel}</p>
            <p className="text-xs text-slate-400 font-mono">{airportCode}</p>
          </div>

          {hasMultiple && (
            <div className="flex items-center gap-1.5">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onNavigate(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-primary-600 w-4' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}