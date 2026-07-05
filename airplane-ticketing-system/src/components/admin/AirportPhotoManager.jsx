import { useState, useRef } from 'react';
import { X, ImagePlus, Star, Loader2 } from 'lucide-react';
import { useUploadAirportPhotos, useDeleteAirportPhoto } from '../../hooks/useAirlinesAirports';

const MAX_PHOTOS = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // NEW

export default function AirportPhotoManager({ airport }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const uploadPhotos = useUploadAirportPhotos();
  const deletePhoto = useDeleteAirportPhoto();

  const existingPhotos = airport?.photos || [];
  const remainingSlots = MAX_PHOTOS - existingPhotos.length - selectedFiles.length;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} more photo(s). Max ${MAX_PHOTOS} total.`);
      e.target.value = '';
      return;
    }

    const validFiles = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`${file.name}: only JPEG, PNG, or WEBP allowed`);
        return false;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`${file.name}: must be under ${MAX_SIZE_MB}MB`);
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
    e.target.value = '';
  };

  const removeSelectedFile = (index) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    uploadPhotos.mutate(
      { airportId: airport.id, files: selectedFiles },
      {
        onSuccess: () => {
          previews.forEach((src) => URL.revokeObjectURL(src));
          setSelectedFiles([]);
          setPreviews([]);
        },
      }
    );
  };

  const handleDeleteExisting = (photoId) => {
    if (window.confirm('Delete this photo?')) {
      deletePhoto.mutate({ airportId: airport.id, photoId });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Photos ({existingPhotos.length + selectedFiles.length}/{MAX_PHOTOS})
        </label>
      </div>

      {(existingPhotos.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-5 gap-2">
          {existingPhotos.map((photo) => (
            <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
              <img src={`${API_BASE_URL}${photo.url}`} alt="" className="w-full h-full object-cover" /> {/* CHANGED */}
              {photo.isPrimary && (
                <span className="absolute top-1 left-1 bg-amber-400 text-white p-0.5 rounded-full">
                  <Star size={10} fill="white" />
                </span>
              )}
              <button
                type="button"
                onClick={() => handleDeleteExisting(photo.id)}
                disabled={deletePhoto.isPending}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <X size={11} />
              </button>
            </div>
          ))}

          {previews.map((src, index) => (
            <div key={`new-${index}`} className="relative group rounded-lg overflow-hidden border-2 border-dashed border-primary-300 aspect-square">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeSelectedFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {remainingSlots > 0 ? (
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
          >
            <ImagePlus size={14} />
            Select photos
          </button>

          {selectedFiles.length > 0 && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploadPhotos.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {uploadPhotos.isPending ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploadPhotos.isPending ? 'Uploading...' : `Upload ${selectedFiles.length}`}
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400">Maximum {MAX_PHOTOS} photos reached.</p>
      )}
    </div>
  );
}