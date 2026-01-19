import React from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';

export interface SponsoredAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string; // Optional video URL (mp4, webm)
  ctaText: string;
  targetUrl: string;
  sponsor: string;
  sponsorLogo?: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  startDate?: Date;
  endDate?: Date;
  targetCategories?: string[];
}

interface SponsoredBannerProps {
  ad: SponsoredAd;
  onImpression?: (adId: string) => void;
  onClick?: (adId: string) => void;
}

export function SponsoredBanner({ ad, onImpression, onClick }: SponsoredBannerProps) {
  // Track impression when banner is rendered
  const handleImpression = () => {
    if (onImpression) {
      onImpression(ad.id);
    }
  };

  // Track click when user clicks on banner
  const handleClick = () => {
    if (onClick) {
      onClick(ad.id);
    }
    // Open in new tab
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Call impression tracking on mount
  React.useEffect(() => {
    handleImpression();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-teal-300 transition-all shadow-sm">
      {/* Sponsored Label */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {ad.sponsorLogo && (
            <img 
              src={ad.sponsorLogo} 
              alt={ad.sponsor}
              className="w-6 h-6 rounded-full"
            />
          )}
          <div>
            <p className="text-xs font-medium text-gray-900">{ad.sponsor}</p>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Sponsored
            </p>
          </div>
        </div>
        <div className="px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-full">
          <span className="text-[10px] text-teal-700 font-medium">AD</span>
        </div>
      </div>

      {/* Banner Content */}
      <div
        onClick={handleClick}
        className="w-full text-left cursor-pointer active:scale-[0.99] transition-transform"
      >
        {/* Video or Image */}
        {ad.videoUrl ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-black">
            <video 
              src={ad.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ) : ad.imageUrl ? (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img 
              src={ad.imageUrl} 
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* Text Content */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-1.5 line-clamp-2">
            {ad.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {ad.description}
          </p>

          {/* CTA Button */}
          <div className="flex items-center justify-between">
            <div className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl text-sm font-medium shadow-sm flex items-center gap-2">
              <span>{ad.ctaText}</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-teal-200 via-teal-300 to-teal-200" />
    </div>
  );
}