import { useState, useRef } from "react";
import { Upload, X, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ImageUploadProps {
  images: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onChange,
  multiple = false,
  maxImages = 10,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (multiple) {
      const combined = [...images, ...newFiles].slice(0, maxImages);
      onChange(combined);
    } else {
      onChange(newFiles.slice(0, 1));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const getImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-purple-500 bg-purple-500/10"
            : "border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
            <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-medium mb-1">
              {multiple ? "Upload Images" : "Upload Image"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Drag and drop or click to browse
            </p>
            {multiple && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                You can upload up to {maxImages} images
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={getImagePreview(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add More Button (for multiple) */}
      {multiple && images.length > 0 && images.length < maxImages && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400"
        >
          <ImagePlus className="w-5 h-5" />
          Add More Images ({images.length}/{maxImages})
        </button>
      )}
    </div>
  );
}
