import { X } from 'lucide-react';

interface ImagePreviewProps {
  images: string[]; // URLs or data URLs
  onRemove: (index: number) => void;
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className={`grid gap-2 ${ 
      images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
    }`}>
      {images.map((image, index) => (
        <div key={index} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group">
          <img
            src={image}
            alt={`Preview ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Remove button */}
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
