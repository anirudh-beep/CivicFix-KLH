import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, X, AlertCircle } from 'lucide-react';

interface PhotoUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  label?: string;
  required?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  selectedFile,
  onFileSelect,
  label = 'Upload Photo Evidence',
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Image size exceeds 10MB limit. Please select a smaller photo.');
      return;
    }

    onFileSelect(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValidationError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xs text-slate-500">Max 10MB (JPG, PNG)</span>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-w-sm">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition shadow"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="p-2 bg-white text-xs text-slate-600 truncate">
            {selectedFile?.name} ({(Number(selectedFile?.size || 0) / 1024).toFixed(1)} KB)
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-6 text-center bg-slate-50 hover:bg-brand-50/50 transition group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-full bg-white group-hover:bg-brand-100 flex items-center justify-center text-slate-500 group-hover:text-brand-600 transition shadow-sm mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">
            Click to upload or take a photo
          </p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP supported</p>
        </div>
      )}
    </div>
  );
};
