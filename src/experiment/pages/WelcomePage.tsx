import React from 'react';
import { Slide } from '../types';
import { ChevronRight } from 'lucide-react';
import { findBestVisualMatch } from '../../utils/visualLibraryMatcher';

export const WelcomePage: React.FC<{
  slide: Slide;
  onNext: () => void;
  slideIndex?: number;
  totalSlides?: number;
  onClose?: () => void;
}> = ({ slide, onNext, slideIndex = 0, totalSlides = 1, onClose }) => {
  const rawRole = slide.role ? slide.role.replace(/^role:\s*/i, '').trim() : 'Frontline Operations';
  const title = slide.title || 'Standard Operating Procedure';
  const body =
    slide.content ||
    'Train associates to verify, execute, control, and hand over without shortcuts.';
  const ctaText = slide.cta || 'Start Training Deck';

  const heroMatch = findBestVisualMatch(`${title} ${rawRole} ${body}`, title);
  const heroPhotoUrl =
    slide.img ||
    heroMatch.url ||
    '/Guruji_Real_Photo_Visual_Library_500/002_retail_cashier_scanning_product.webp';

  const kickerText = `${rawRole.toUpperCase()}  ·  OPERATIONAL CONTROL`;

  return (
    <div className="min-h-full w-full bg-[#ECE8DF] text-[#1A2129] flex flex-col justify-between relative overflow-y-auto">
      {/* Top Editorial Navigation Bar */}
      <div className="h-14 px-4 sm:px-8 flex items-center justify-between border-b border-[#D8D2C5] bg-[#F6F4EE]/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="h-9 px-3.5 rounded-lg bg-[#E5E0D5] hover:bg-[#DAD3C5] text-[#1A2129] flex items-center gap-1.5 cursor-pointer transition-colors font-bold text-xs"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back</span>
            </button>
          )}
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5A626A] font-semibold truncate max-w-[220px] sm:max-w-md">
            {title}
          </span>
        </div>

        <span className="font-mono text-[11px] font-bold text-[#364958] bg-[#E5E0D5] px-2.5 py-1 rounded">
          {slideIndex + 1} / {totalSlides}
        </span>
      </div>

      {/* Main Gamma Card 1: Full-Bleed Contextual Photo + Floating Warm-Cream Editorial Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-5xl rounded-sm overflow-hidden shadow-[0_12px_40px_rgba(26,33,41,0.10)] border border-[#D8D2C5] bg-[#FBF9F5] relative min-h-[420px] sm:min-h-[480px] flex items-center">
          {/* Full-Bleed Contextual Workplace Photograph */}
          <img
            src={heroPhotoUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle warm architectural vignette so right side remains bright and authentic */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2129]/45 via-[#1A2129]/15 to-transparent pointer-events-none" />

          {/* Floating Editorial Card on Left (Matches Gamma Card 1 in IMG_7848) */}
          <div className="relative z-10 m-4 sm:m-8 md:m-10 w-full max-w-xl bg-[#F4F2EC]/95 backdrop-blur-md p-6 sm:p-9 border border-[#DCD6C8] shadow-xl">
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#2C353D] font-semibold mb-3">
              {kickerText}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#181F26] leading-[1.15] pb-5 border-b-[1.5px] border-[#2C353D]">
              {title}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#2E3740] leading-relaxed font-normal">
              {body}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                onClick={onNext}
                className="cta inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#C84B11] hover:bg-[#AD3E0B] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer shadow-sm"
              >
                <span>{ctaText}</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5A626A]">
                {totalSlides - 1} Operational Control Cards
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
