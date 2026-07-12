import { useState } from 'react';
import { Plane, Clock, Expand, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../common/Badge';
import AirportPhotoModal from './AirportPhotoModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// normalizes backend photo objects into { id, fullUrl } and sorts primary first
function normalizePhotos(photos) {
  if (!photos || photos.length === 0) return [];
  return [...photos]
    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0) || a.displayOrder - b.displayOrder)
    .map((p) => ({ id: p.id, fullUrl: `${API_BASE_URL}${p.url}` }));
}

// Compact tile meant to sit in a stacked left-hand column (used twice: origin, destination)
function AirportGalleryTile({ photos, iataCode, cityName, onExpand }) {
  const [index, setIndex] = useState(0);
  const hasPhotos = photos.length > 0;
  const hasMultiple = photos.length > 1;

  const goPrev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  };
  const goNext = (e) => {
    e.stopPropagation();
    setIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 w-full">
      {hasPhotos ? (
        <button type="button" onClick={() => onExpand(index)} className="block w-full h-full text-left">
          <img
            src={photos[index].fullUrl}
            alt={iataCode}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
              <Expand size={14} className="text-slate-700" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2.5 flex items-end justify-between">
            <div>
              <p className="text-white font-semibold text-xs leading-tight drop-shadow-sm">{cityName}</p>
              <p className="text-white/80 text-[10px] font-mono tracking-wide">{iataCode}</p>
            </div>
            {hasMultiple && (
              <div className="flex items-center gap-1">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === index ? 'w-3 bg-white' : 'w-1 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </button>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-200">
          <ImageOff size={16} className="text-slate-300" />
          <span className="text-[10px] text-slate-400 font-medium">No image</span>
          <span className="text-[10px] text-slate-400 font-mono">{iataCode}</span>
        </div>
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight size={12} />
          </button>
        </>
      )}
    </div>
  );
}

export default function FlightCard({ flight, onSelect, selected }) {
  const [modalState, setModalState] = useState(null); // { which: 'origin'|'destination', index }

  const originPhotos = normalizePhotos(flight.originPhotos);
  const destinationPhotos = normalizePhotos(flight.destinationPhotos);

  const openModal = (which, index) => setModalState({ which, index });
  const closeModal = () => setModalState(null);

  const activePhotos = modalState?.which === 'origin' ? originPhotos : destinationPhotos;
  const activeLabel = modalState?.which === 'origin'
    ? { code: flight.originIata, city: flight.originCity }
    : { code: flight.destinationIata, city: flight.destinationCity };

  return (
    <div>
      {/* Flight card itself — border only wraps flight info, not the photos */}
      <div
        className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 ${
          selected
            ? 'border border-emerald bg-emerald/5 ring-1 ring-emerald/20'
            : 'border border-slate-100 hover:border-emerald/20 hover:shadow-soft'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Airline */}
          <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
            {flight.airlineLogoUrl ? (
              <img src={flight.airlineLogoUrl} alt={flight.airlineName} className="w-9 h-9 object-contain" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <Plane size={16} className="text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-700">{flight.airlineName}</p>
              <p className="text-xs text-slate-400">
                {flight.flightNumber} · {flight.aircraftModel}
              </p>
            </div>
          </div>

          {/* Route & times */}
          <div className="flex-1 flex items-center justify-between sm:justify-center sm:gap-8">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">
                {format(new Date(flight.departureTime), 'h:mm a')}
              </p>
              <p className="text-xs text-slate-400">{flight.originIata}</p>
            </div>

            <div className="flex flex-col items-center px-2">
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                <Clock size={11} /> {formatDuration(flight.durationMinutes)}
              </p>
              <div className="w-16 sm:w-24 h-px bg-slate-200 relative">
                <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald/60" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">
                {format(new Date(flight.arrivalTime), 'h:mm a')}
              </p>
              <p className="text-xs text-slate-400">{flight.destinationIata}</p>
            </div>
          </div>

          {/* Price & action */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:w-36 flex-shrink-0 gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-5">
            <div className="text-right">
              <p className="text-xl font-bold text-emerald">${flight.totalPrice.toFixed(2)}</p>
              <p className="text-xs text-slate-400">{flight.requestedClass}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(flight)}
              className={`!py-2 !px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                selected
                  ? 'bg-emerald/10 text-emerald'
                  : 'bg-emerald text-white hover:bg-emerald-dark hover:-translate-y-0.5'
              }`}
            >
              {selected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>

        {flight.status !== 'Scheduled' && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <Badge status={flight.status} />
          </div>
        )}
      </div>

      {/* Airport photos — sits outside/below the card border, origin left, destination right */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <AirportGalleryTile
          photos={originPhotos}
          iataCode={flight.originIata}
          cityName={flight.originCity}
          onExpand={(idx) => openModal('origin', idx)}
        />
        <AirportGalleryTile
          photos={destinationPhotos}
          iataCode={flight.destinationIata}
          cityName={flight.destinationCity}
          onExpand={(idx) => openModal('destination', idx)}
        />
      </div>

      <AirportPhotoModal
        isOpen={!!modalState}
        onClose={closeModal}
        photos={activePhotos}
        currentIndex={modalState?.index ?? 0}
        onNavigate={(idx) => setModalState((prev) => ({ ...prev, index: idx }))}
        airportCode={activeLabel.code}
        airportLabel={activeLabel.city}
      />
    </div>
  );
}