"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { validateImage } from "@/lib/imageUtils";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<string | null>;
  existingImages?: string[];
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  existingImages = [],
}: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image using utility function
    const validation = validateImage(file);
    if (!validation.isValid) {
      setError(validation.error || "Invalid image file");
      return;
    }

    setError("");
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const imageUrl = await onUpload(selectedFile);
      if (imageUrl) {
        // Reset form
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onClose();
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setPreview(null);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Upload Weekly Image</h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Existing Images Preview */}
          {existingImages.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Current Weekly Images ({existingImages.length})
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {existingImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                  >
                    <Image
                      src={img}
                      alt={`Weekly image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Input Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              {preview ? (
                <div className="space-y-4">
                  <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{selectedFile?.name}</p>
                    <p>
                      Size: {(selectedFile?.size || 0) / 1024 / 1024} MB
                      {selectedFile && (
                        <span className="text-gray-500 ml-2">
                          (Will be compressed before upload)
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <ImageIcon size={48} className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">
                      Click to select an image
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      JPEG, PNG, GIF, WebP up to 5MB
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Image will be automatically compressed and optimized
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              disabled={uploading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
