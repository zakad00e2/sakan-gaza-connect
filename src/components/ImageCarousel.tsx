import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCarouselProps {
  images: { id: string; url: string }[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

  // تحميل جميع الصور مسبقاً عند تحميل المكون
  useEffect(() => {
    if (images.length <= 1) return;

    images.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };
      img.src = image.url;
    });
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
        <span className="text-muted-foreground">لا توجد صور</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden">
      {/* تحميل جميع الصور في الخلفية */}
      {images.map((image, idx) => (
        <img
          key={image.id}
          src={image.url}
          alt={`صورة ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* مؤشر التحميل */}
      {!loadedImages.has(currentIndex) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 z-20"
            onClick={goToPrevious}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 z-20"
            onClick={goToNext}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-white w-6" : "bg-white/50"
                } ${loadedImages.has(idx) ? "" : "animate-pulse"}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
