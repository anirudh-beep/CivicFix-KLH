import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, RefreshCw } from 'lucide-react';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
  onChange: (data: { latitude: number; longitude: number; address: string }) => void;
  required?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  address,
  onChange,
  required = false,
}) => {
  const [detecting, setDetecting] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState<boolean>(false);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please enter location manually.');
      setShowManual(true);
      return;
    }

    setDetecting(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetecting(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        onChange({
          latitude: lat,
          longitude: lng,
          address: address || `GPS Coordinates: ${lat}, ${lng}`,
        });
      },
      (err) => {
        setDetecting(false);
        let msg = 'Unable to retrieve location.';
        if (err.code === 1) msg = 'Location permission was denied. Please allow GPS or enter coordinates manually.';
        else if (err.code === 2) msg = 'Position unavailable. Please retry or enter manually.';
        else if (err.code === 3) msg = 'Location request timed out. Please retry.';
        
        setGpsError(msg);
        setShowManual(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">
          Location & GPS {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={requestGeolocation}
          disabled={detecting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition border border-brand-200 disabled:opacity-50"
        >
          {detecting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-brand-600" />
          )}
          {detecting ? 'Detecting GPS…' : 'Detect My Location'}
        </button>
      </div>

      {gpsError && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{gpsError}</span>
            <button
              type="button"
              onClick={requestGeolocation}
              className="ml-2 font-bold underline hover:text-amber-950"
            >
              Retry GPS
            </button>
          </div>
        </div>
      )}

      {/* Address / Landmark field */}
      <div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Address or nearby landmark (e.g. Near Main Gate, Banjara Hills)"
            value={address}
            onChange={(e) =>
              onChange({
                latitude: latitude ?? 17.385,
                longitude: longitude ?? 78.4867,
                address: e.target.value,
              })
            }
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required={required}
          />
        </div>
      </div>

      {/* Geotag summary or manual coordinate overrides */}
      {latitude !== null && longitude !== null ? (
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              GPS: <strong>{latitude.toFixed(5)}</strong>, <strong>{longitude.toFixed(5)}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowManual(!showManual)}
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            {showManual ? 'Hide manual coordinates' : 'Edit coordinates'}
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Click "Detect My Location" or expand manual coordinates below.
        </p>
      )}

      {showManual && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude ?? ''}
              placeholder="e.g. 17.3850"
              onChange={(e) =>
                onChange({
                  latitude: parseFloat(e.target.value) || 0,
                  longitude: longitude ?? 78.4867,
                  address,
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude ?? ''}
              placeholder="e.g. 78.4867"
              onChange={(e) =>
                onChange({
                  latitude: latitude ?? 17.385,
                  longitude: parseFloat(e.target.value) || 0,
                  address,
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
