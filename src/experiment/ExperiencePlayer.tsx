import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SlidePlan } from './types';
import { Lesson } from '../types';
import { WelcomePage } from './pages/WelcomePage';
import { requestAiSopImage, getCachedAiSopImage, findBestVisualMatch } from '../utils/visualLibraryMatcher';
import {
  buildTeachingBlueprint,
  buildAdaptiveDeckFromBlueprint,
  validateAdaptiveDeckAgainstSop,
  AdaptiveDeckSlide,
  GammaMicroItem,
} from './teachingBlueprint';
import {
  sanitizeLearnerText,
  synthesizeEditorialMicroCopy,
  isDuplicateLearnerCopy,
} from '../utils/learnerCopySanitizer';

/* ------------------------------------------------------------------ *
 * Terracotta Circular Editorial Icons (Matches Gamma's Icon Style)   *
 * ------------------------------------------------------------------ */
const GammaCircleIcon: React.FC<{ type?: GammaMicroItem['iconType']; index?: number }> = ({
  type,
  index = 0,
}) => {
  const resolvedType =
    type ||
    (['building', 'check', 'user', 'key', 'route', 'shield', 'file'][index % 7] as GammaMicroItem['iconType']);

  return (
    <span className="w-7 h-7 rounded-full bg-[#C84B11] text-white inline-flex items-center justify-center shrink-0 shadow-xs">
      {resolvedType === 'building' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
        </svg>
      )}
      {resolvedType === 'user' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" />
        </svg>
      )}
      {resolvedType === 'key' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <circle cx="8" cy="15" r="4" />
          <path d="M11.3 12.2 19 4.5M16 7.5l2.5 2.5M18.5 5l2 2" />
        </svg>
      )}
      {resolvedType === 'route' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <path d="M5 19V5l7 3 7-3v14l-7 3-7-3Z" />
        </svg>
      )}
      {resolvedType === 'shield' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <path d="M12 3 4 7v6c0 5 3.6 7.8 8 9 4.4-1.2 8-4 8-9V7l-8-4Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )}
      {resolvedType === 'file' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      )}
      {(resolvedType === 'check' || resolvedType === 'alert' || !resolvedType) && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </span>
  );
};

/* ------------------------------------------------------------------ *
 * Unified Editorial Card Header (Consistent Placement Across Deck)   *
 * ------------------------------------------------------------------ */
const GammaCardHeader: React.FC<{
  kicker: string;
  title: string;
  subtitle?: string;
}> = ({ kicker, title, subtitle }) => {
  const cleanKicker = sanitizeLearnerText(kicker) || 'TRAINING STEP';
  const cleanTitle = sanitizeLearnerText(title);
  const cleanSubtitle = subtitle ? sanitizeLearnerText(subtitle) : '';
  const showSubtitle =
    cleanSubtitle &&
    cleanSubtitle.length > 12 &&
    !isDuplicateLearnerCopy(cleanTitle, cleanSubtitle) &&
    !/^(Complete every|Follow the sequence|Learn how to)/i.test(cleanSubtitle);

  return (
    <header className="pb-5 border-b-[1.5px] border-[#1E252B]">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C84B11] font-bold mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C84B11] inline-block shrink-0" />
        <span>{cleanKicker}</span>
      </div>
      <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#181F26] leading-[1.2] tracking-tight">
        {cleanTitle}
      </h2>
      {showSubtitle && (
        <p className="mt-2 text-sm text-[#4A545E] leading-relaxed max-w-2xl">
          {cleanSubtitle}
        </p>
      )}
    </header>
  );
};

/* ------------------------------------------------------------------ *
 * Full-Bleed Burnt-Orange Stop Banner (Matches Gamma's Footer Strip) *
 * ------------------------------------------------------------------ */
const GammaStopBannerStrip: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  const cleaned = sanitizeLearnerText(text);
  if (!cleaned) return null;
  return (
    <div className="w-full bg-[#C84B11] text-white px-6 py-3 text-center font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] select-none">
      {cleaned}
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Renders a Single Gamma Editorial Card based on its Archetype       *
 * ------------------------------------------------------------------ */
const GammaEditorialSlideCard: React.FC<{
  slide: AdaptiveDeckSlide;
  aiPhotoUrl: string | null;
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  checkedItems: Record<string, boolean>;
  onToggleCheck: (key: string) => void;
  onComplete?: () => void;
}> = ({
  slide,
  aiPhotoUrl,
  selectedOptionId,
  onSelectOption,
}) => {
  const archetype = slide.gammaArchetype || 'ledger_with_stop_banner';
  const kicker = sanitizeLearnerText(slide.gammaKicker || slide.layoutName || `STEP 0${slide.num}`).toUpperCase();
  const resolvedPhotoUrl =
    aiPhotoUrl ||
    slide.photoUrl ||
    '/Guruji_Real_Photo_Visual_Library_500/009_hospitality_room_cleaning.webp';

  // Ensure every micro-item has a clean semantic concept heading and zero stutter/duplication
  const microItems: GammaMicroItem[] = useMemo(() => {
    const rawItems =
      slide.gammaMicroItems && slide.gammaMicroItems.length > 0
        ? slide.gammaMicroItems
        : (slide.cards || []).map((c, idx) => ({
            badge: String(idx + 1).padStart(2, '0'),
            title: c.label && !/^Step \d+$/i.test(c.label) ? c.label : c.value,
            body: c.subtext && c.subtext !== c.value ? c.subtext : c.why || c.value,
            consequence: c.consequence,
            iconType: (['building', 'check', 'user', 'key', 'route', 'shield'][idx % 6] as GammaMicroItem['iconType']),
          }));

    return rawItems.map((item, idx) => {
      const pair = synthesizeEditorialMicroCopy(item.title, item.body, undefined, `Checkpoint 0${idx + 1}`);
      return {
        ...item,
        badge: item.badge || String(idx + 1).padStart(2, '0'),
        title: pair.title,
        body: pair.body,
      };
    });
  }, [slide]);

  /* ================================================================== *
   * ARCHETYPE 1: SPLIT PHOTO + NUMBERED ORANGE HAIRLINE LINES          *
   * ================================================================== */
  if (archetype === 'split_photo_numbered_lines') {
    return (
      <article className="relative z-10 w-full bg-[#FBF9F5] border border-[#DCD6C8] shadow-[0_8px_32px_rgba(26,33,41,0.06)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
          {/* Left 5-col Full-Bleed Vertical Photograph */}
          <div className="md:col-span-5 relative min-h-[260px] md:min-h-full bg-[#E5E0D5]">
            <img
              src={resolvedPhotoUrl}
              alt={sanitizeLearnerText(slide.title)}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

          {/* Right 7-col Editorial Content */}
          <div className="md:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <GammaCardHeader kicker={kicker} title={slide.title} subtitle={slide.subtitle} />

              <div className="mt-7 space-y-6">
                {microItems.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-3 pb-2.5 border-b-[1.5px] border-[#C84B11]">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C84B11] text-white font-mono text-[11px] font-bold shrink-0">
                        {item.badge}
                      </span>
                      <h3 className="text-base sm:text-[17px] font-extrabold text-[#181F26] leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    {item.body && !isDuplicateLearnerCopy(item.title, item.body) && (
                      <p className="mt-2.5 text-sm sm:text-[15px] text-[#3A434C] leading-relaxed">
                        {item.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ================================================================== *
   * ARCHETYPE 2: STACKED NUMBERED LEDGER + FULL-BLEED STOP BANNER      *
   * ================================================================== */
  if (archetype === 'ledger_with_stop_banner' || archetype === 'non_negotiable_ledger') {
    const itemsToRender =
      archetype === 'non_negotiable_ledger' && slide.cards.length > 0
        ? slide.cards.map((c, idx) => {
            const rawHeading =
              c.label && !/^(Avoid This|Do This|Standard|Step \d+)$/i.test(c.label) ? c.label : '';
            const pair = synthesizeEditorialMicroCopy(rawHeading, c.subtext || c.consequence || c.value, undefined, `Rule 0${idx + 1}`);
            return {
              badge: String(idx + 1).padStart(2, '0'),
              title: pair.title,
              body: pair.body || sanitizeLearnerText(c.value),
            };
          })
        : microItems.map((m, idx) => ({
            badge: String(idx + 1).padStart(2, '0'),
            title: m.title,
            body: m.body,
          }));

    return (
      <article className="relative z-10 w-full bg-[#FBF9F5] border border-[#DCD6C8] shadow-[0_8px_32px_rgba(26,33,41,0.06)] overflow-hidden">
        <div className="p-7 sm:p-10 lg:p-12">
          <GammaCardHeader kicker={kicker} title={slide.title} subtitle={slide.subtitle} />

          <div className="mt-2 divide-y divide-[#2C353D]/25">
            {itemsToRender.map((item, idx) => (
              <div key={idx} className="py-5 sm:py-6 flex items-start gap-4 sm:gap-5">
                <span className="w-7 h-7 rounded-full bg-[#C84B11] text-white font-mono text-xs font-bold inline-flex items-center justify-center shrink-0 mt-0.5">
                  {item.badge}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#181F26] leading-snug">
                    {item.title}
                  </h3>
                  {item.body && !isDuplicateLearnerCopy(item.title, item.body) && (
                    <p className="mt-1.5 text-sm sm:text-[15px] text-[#3A434C] leading-relaxed">
                      {item.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <GammaStopBannerStrip text={slide.gammaStopBanner} />
      </article>
    );
  }

  /* ================================================================== *
   * ARCHETYPE 3: 2-OVER-1 HAIRLINE GRID + FULL-BLEED STOP BANNER       *
   * ================================================================== */
  if (archetype === 'two_over_one_grid') {
    const topPair = microItems.slice(0, 2);
    const bottomItems = microItems.slice(2);

    return (
      <article className="relative z-10 w-full bg-[#FBF9F5] border border-[#DCD6C8] shadow-[0_8px_32px_rgba(26,33,41,0.06)] overflow-hidden">
        <div className="p-7 sm:p-10 lg:p-12">
          <GammaCardHeader kicker={kicker} title={slide.title} subtitle={slide.subtitle} />

          {/* Top 2 Columns separated by a 1.5px vertical hairline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b-[1.5px] border-[#2C353D]/40">
            {topPair.map((item, idx) => (
              <div
                key={idx}
                className={`py-6 sm:py-7 ${
                  idx === 0
                    ? 'sm:pr-8 border-b sm:border-b-0 sm:border-r-[1.5px] border-[#2C353D]/40'
                    : 'sm:pl-8'
                }`}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <GammaCircleIcon type={item.iconType} index={idx} />
                  <h3 className="text-base sm:text-lg font-extrabold text-[#181F26] leading-snug">
                    {item.title}
                  </h3>
                </div>
                {item.body && !isDuplicateLearnerCopy(item.title, item.body) && (
                  <p className="text-sm sm:text-[15px] text-[#3A434C] leading-relaxed pl-10">
                    {item.body}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Full-Width Row(s) */}
          {bottomItems.length > 0 && (
            <div className="divide-y divide-[#2C353D]/25">
              {bottomItems.map((item, idx) => (
                <div key={idx} className="pt-6 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <GammaCircleIcon type={item.iconType} index={idx + 2} />
                    <h3 className="text-base sm:text-lg font-extrabold text-[#181F26] leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  {item.body && !isDuplicateLearnerCopy(item.title, item.body) && (
                    <p className="text-sm sm:text-[15px] text-[#3A434C] leading-relaxed pl-10">
                      {item.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <GammaStopBannerStrip text={slide.gammaStopBanner} />
      </article>
    );
  }

  /* ================================================================== *
   * ARCHETYPE 4: DARK SLATE ANCHOR SIDEBAR + RIGHT MULTI-COLUMN STRIP  *
   * ================================================================== */
  if (archetype === 'dark_anchor_three_column') {
    const isProcessSpine = slide.visualFormat === 'process_flow';
    const thesisHeadline = sanitizeLearnerText(
      slide.gammaAnchorThesis?.headline ||
        (isProcessSpine ? 'Follow the spine.' : 'Verify then confirm.')
    );
    const thesisBody = sanitizeLearnerText(
      slide.gammaAnchorThesis?.body ||
        slide.whyItMatters ||
        'Execution is complete only when every sequential verification gate is confirmed.'
    );

    const columns = isProcessSpine
      ? slide.cards.map((c, idx) => {
          const pair = synthesizeEditorialMicroCopy(c.label, c.subtext || c.value, undefined, `Stage 0${idx + 1}`);
          return {
            badge: String(idx + 1).padStart(2, '0'),
            title: pair.title,
            body: pair.body || sanitizeLearnerText(c.value),
          };
        })
      : microItems;

    return (
      <article className="relative z-10 w-full bg-[#FBF9F5] border border-[#DCD6C8] shadow-[0_8px_32px_rgba(26,33,41,0.06)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          {/* Left 4-Col Deep Slate-Blue Anchor Panel (#364958) */}
          <div className="md:col-span-4 bg-[#364958] text-white p-7 sm:p-9 flex flex-col justify-between">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#E5E0D5] font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84B11] inline-block shrink-0" />
              <span>{kicker}</span>
            </div>

            <div className="my-8">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.12] text-white">
                {thesisHeadline}
              </div>
              <p className="mt-4 text-xs sm:text-sm text-[#D5DEE5] leading-relaxed">
                {thesisBody}
              </p>
            </div>
          </div>

          {/* Right 8-Col Multi-Column Strip */}
          <div className="md:col-span-8 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#181F26] leading-[1.2] tracking-tight pb-5 border-b-[1.5px] border-[#1E252B]">
                {sanitizeLearnerText(slide.title)}
              </h2>

              <div
                className={`mt-7 grid grid-cols-1 ${
                  columns.length === 2
                    ? 'sm:grid-cols-2'
                    : columns.length >= 3
                    ? 'sm:grid-cols-3'
                    : 'sm:grid-cols-1'
                } gap-7`}
              >
                {columns.map((col, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="pb-2.5 border-b-[1.5px] border-[#C84B11] mb-3.5">
                      <span className="w-6 h-6 rounded-full bg-[#C84B11] text-white font-mono text-[11px] font-bold inline-flex items-center justify-center">
                        {col.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#181F26] leading-snug">
                      {col.title}
                    </h3>
                    {col.body && !isDuplicateLearnerCopy(col.title, col.body) && (
                      <p className="mt-2 text-sm text-[#3A434C] leading-relaxed">
                        {col.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {isProcessSpine && <GammaStopBannerStrip text={slide.gammaStopBanner} />}
      </article>
    );
  }

  /* ================================================================== *
   * ARCHETYPE 5: 2x2 ARCHITECTURAL CROSSHAIR QUAD GRID                 *
   * ================================================================== */
  if (archetype === 'crosshair_quad_grid') {
    const quadItems = microItems.slice(0, 6);

    return (
      <article className="relative z-10 w-full bg-[#FBF9F5] border border-[#DCD6C8] shadow-[0_8px_32px_rgba(26,33,41,0.06)] overflow-hidden">
        <div className="p-7 sm:p-10 lg:p-12">
          <GammaCardHeader kicker={kicker} title={slide.title} subtitle={slide.subtitle} />

          {/* 2-Column Architectural Crosshair Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-2">
            {quadItems.map((item, idx) => {
              const isLeftCol = idx % 2 === 0;
              const isLastRow = idx >= quadItems.length - (quadItems.length % 2 === 0 ? 2 : 1);
              return (
                <div
                  key={idx}
                  className={`py-6 sm:py-7 ${
                    isLeftCol ? 'sm:pr-8 sm:border-r-[1.5px] border-[#2C353D]/40' : 'sm:pl-8'
                  } ${!isLastRow ? 'border-b-[1.5px] border-[#2C353D]/40' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <GammaCircleIcon type={item.iconType} index={idx} />
                    <h3 className="text-base sm:text-lg font-extrabold text-[#181F26] leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  {item.body && !isDuplicateLearnerCopy(item.title, item.body) && (
                    <p className="text-sm sm:text-[15px] text-[#3A434C] leading-relaxed pl-10">
                      {item.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {slide.gammaStopBanner && <GammaStopBannerStrip text={slide.gammaStopBanner} />}
      </article>
    );
  }

  /* ================================================================== *
   * ARCHETYPE 6: LEFT ICON-INLINE LIST + RIGHT SPLIT-BLEED PHOTO       *
   * ================================================================== */
  if (archetype === 'inline_icon_split_photo') {
    return (
      <article className="relative z-10 w-full bg-[#FBF9F5] border border-[#DCD6C8] shadow-[0_8px_32px_rgba(26,33,41,0.06)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
          {/* Left 7-Col Icon-Inline Rows */}
          <div className="md:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <GammaCardHeader kicker={kicker} title={slide.title} subtitle={slide.subtitle} />

              <div className="mt-2 divide-y divide-[#2C353D]/30">
                {microItems.map((item, idx) => (
                  <div key={idx} className="py-4 sm:py-5 flex items-start gap-4">
                    <GammaCircleIcon type={item.iconType} index={idx + 3} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold text-[#181F26] leading-snug">
                        {item.title}
                      </h3>
                      {item.body && !isDuplicateLearnerCopy(item.title, item.body) && (
                        <p className="mt-1 text-sm sm:text-[15px] text-[#2E3740] leading-relaxed">
                          {item.body}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5-Col Vertical Full-Bleed Photo */}
          <div className="md:col-span-5 relative min-h-[260px] md:min-h-full bg-[#E5E0D5]">
            <img
              src={resolvedPhotoUrl}
              alt={sanitizeLearnerText(slide.title)}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </article>
    );
  }

  /* ================================================================== *
   * ARCHETYPE 7: 2x2 CHECKERBOARD EXCEPTION MATRIX + STOP BANNER       *
   * ================================================================== */
  if (archetype === 'checkerboard_exception_matrix') {
    return (
      <article className="relative z-10 w-full bg-[#FBF9F5] border border-[#DCD6C8] shadow-[0_8px_32px_rgba(26,33,41,0.06)] overflow-hidden">
        <div className="p-7 sm:p-10 lg:p-12">
          <GammaCardHeader kicker={kicker} title={slide.title} subtitle={slide.subtitle} />

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {slide.cards.map((card, idx) => {
              const isDarkSlate = idx % 2 === 0;
              const pair = synthesizeEditorialMicroCopy(
                card.label && !/^If \/ When$/i.test(card.label) ? card.label : '',
                card.value,
                undefined,
                `Exception 0${idx + 1}`
              );
              const conditionTitle = sanitizeLearnerText(card.value) || pair.title;
              const actionBody = sanitizeLearnerText(
                card.subtext || card.consequence || 'Pause, recheck, and escalate to your supervisor.'
              );

              return (
                <div
                  key={card.id || idx}
                  className={`p-6 sm:p-7 flex flex-col justify-between min-h-[160px] ${
                    isDarkSlate
                      ? 'bg-[#364958] text-white'
                      : 'bg-[#F4F1EA] text-[#181F26] border border-[#D5CFC0]'
                  }`}
                >
                  <div>
                    <div
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] font-bold mb-2 ${
                        isDarkSlate ? 'text-[#E5E0D5]/80' : 'text-[#C84B11]'
                      }`}
                    >
                      { sanitizeLearnerText(card.tag || `SCENARIO 0${idx + 1}`) }
                    </div>
                    <h3
                      className={`text-base sm:text-lg font-extrabold leading-snug ${
                        isDarkSlate ? 'text-white' : 'text-[#181F26]'
                      }`}
                    >
                      {conditionTitle}
                    </h3>
                  </div>
                  {!isDuplicateLearnerCopy(conditionTitle, actionBody) && (
                    <p
                      className={`mt-3 pt-3 border-t text-sm leading-relaxed ${
                        isDarkSlate
                          ? 'border-white/15 text-[#DCE4EA]'
                          : 'border-[#1E252B]/15 text-[#3A434C]'
                      }`}
                    >
                      {actionBody}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <GammaStopBannerStrip text={slide.gammaStopBanner || 'PAUSE · RECHECK · ESCALATE · DO NOT GUESS'} />
      </article>
    );
  }

  /* ================================================================== *
   * ARCHETYPE 8: CLOSE THE LOOP + INTERACTIVE ROLE-PLAY MASTERY GATE   *
   * ================================================================== */
  return (
    <article className="relative z-10 w-full bg-[#FBF9F5] border border-[#DCD6C8] shadow-[0_8px_32px_rgba(26,33,41,0.06)] overflow-hidden">
      {/* Top Half: Gamma Close The Loop Split Photo Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
        <div className="md:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <GammaCardHeader kicker={kicker} title={slide.title} subtitle={slide.subtitle} />

            <div className="mt-2 divide-y divide-[#2C353D]/30">
              {microItems.map((item, idx) => (
                <div key={idx} className="py-4 sm:py-5 flex items-start gap-4">
                  <GammaCircleIcon type={item.iconType} index={idx} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-[#181F26] leading-snug">
                      {item.title}
                    </h3>
                    {item.body && !isDuplicateLearnerCopy(item.title, item.body) && (
                      <p className="mt-1 text-sm sm:text-[15px] text-[#2E3740] leading-relaxed">
                        {item.body}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-5 relative min-h-[240px] md:min-h-full bg-[#E5E0D5]">
          <img
            src={resolvedPhotoUrl}
            alt={sanitizeLearnerText(slide.title)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Bottom Half: Interactive Role-Play Verification */}
      {slide.interactiveCheck && (
        <div className="border-t border-[#DCD6C8] bg-[#F3F0E6] p-7 sm:p-10 lg:p-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C84B11] font-bold mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84B11] inline-block shrink-0" />
            <span>FINAL DEMONSTRATION · DECISION CHECKPOINT</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#181F26] leading-snug mb-6 max-w-3xl">
            {sanitizeLearnerText(slide.interactiveCheck.question)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slide.interactiveCheck.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              let cardClasses =
                'bg-[#FBF9F5] border-[#D5CFC0] hover:border-[#364958] text-[#181F26]';
              if (isSelected) {
                cardClasses = opt.isCorrect
                  ? 'bg-[#EBF5EE] border-[#1F6E43] text-[#103B23]'
                  : 'bg-[#FDF0ED] border-[#C84B11] text-[#5C1D04]';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => onSelectOption(opt.id)}
                  className={`p-5 sm:p-6 border-[1.5px] text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${cardClasses}`}
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className={`w-6 h-6 rounded-full font-mono text-xs font-bold inline-flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-[#1F6E43] text-white'
                            : 'bg-[#C84B11] text-white'
                          : 'bg-[#364958] text-white'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-bold leading-relaxed">
                      {sanitizeLearnerText(opt.text)}
                    </span>
                  </div>

                  {isSelected && (
                    <div
                      className={`text-xs font-semibold pt-3 border-t leading-relaxed ${
                        opt.isCorrect
                          ? 'border-[#1F6E43]/25 text-[#1F6E43]'
                          : 'border-[#C84B11]/25 text-[#C84B11]'
                      }`}
                    >
                      {sanitizeLearnerText(opt.feedback)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
};

/* ================================================================== *
 * Main ExperiencePlayer Component                                    *
 * Supports both Gamma Scroll View (Continuous Deck) & Slide View     *
 * ================================================================== */
export const ExperiencePlayer: React.FC<{
  plan: SlidePlan;
  lesson?: Lesson;
  onComplete?: () => void;
  onClose?: () => void;
}> = ({ plan, lesson, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [viewMode, setViewMode] = useState<'gamma_scroll' | 'single_slide'>('gamma_scroll');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [aiSlidePhotos, setAiSlidePhotos] = useState<Record<number, string>>({});
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Build Pedagogical Teaching Blueprint + Gamma Editorial Slides
  const { blueprint, adaptiveSlides } = useMemo(() => {
    const bp = buildTeachingBlueprint(lesson, plan);
    const slides = buildAdaptiveDeckFromBlueprint(bp, lesson, plan);
    validateAdaptiveDeckAgainstSop(bp, slides, lesson);
    return { blueprint: bp, adaptiveSlides: slides };
  }, [lesson, plan]);

  const totalSlides = adaptiveSlides.length + 1;
  const activeAdaptiveSlide: AdaptiveDeckSlide | undefined =
    currentIndex > 0 ? adaptiveSlides[currentIndex - 1] : adaptiveSlides[0];

  // Request AI-generated contextual photo ONLY for slides that use photo archetypes
  useEffect(() => {
    let cancelled = false;
    adaptiveSlides.forEach((slide) => {
      if (!slide.requiresOperationalPhoto || !slide.photoPrompt) return;
      if (aiSlidePhotos[slide.num]) return;

      const cached = getCachedAiSopImage({
        prompt: slide.photoPrompt,
        sopTitle: blueprint.sopTitle,
        stepTitle: slide.title,
      });
      if (cached) {
        setAiSlidePhotos((prev) => ({ ...prev, [slide.num]: cached }));
        return;
      }

      requestAiSopImage({
        prompt: slide.photoPrompt,
        role: blueprint.role,
        stepTitle: slide.title,
        sopTitle: blueprint.sopTitle,
        aspectRatio: '4:3',
      }).then((generatedUrl) => {
        if (!cancelled && generatedUrl) {
          setAiSlidePhotos((prev) => ({ ...prev, [slide.num]: generatedUrl }));
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [adaptiveSlides, blueprint.sopTitle, blueprint.role]);

  const cleanSopTitle = useMemo(() => {
    let title = sanitizeLearnerText(blueprint.sopTitle);
    title = title.replace(/\.(txt|pdf|docx)$/i, '').replace(/_sop_test$/i, '').replace(/_test$/i, '').replace(/_+/g, ' ').replace(/\s*[-–—]\s*/g, ' — ').replace(/\s{2,}/g, ' ').trim();
    return title;
  }, [blueprint.sopTitle]);

  const cleanRole = useMemo(() => {
    let r = sanitizeLearnerText(blueprint.role);
    // Bounded role guard: if role exceeds 35 chars or contains leaked purpose keywords, extract just the role title
    if (r.length > 35 || /\b(?:purpose|prepare|execute|standard|cleaning|turnover|process|department)\b/i.test(r)) {
      r = r.split(/[•\n\r|;]|(?:\s+(?:purpose|prepare|execute|by|standard|process|department)\b)/i)[0].trim();
      if (r.length > 35) r = r.slice(0, 35).trim();
    }
    return r || 'Frontline Specialist';
  }, [blueprint.role]);

  const cleanPurpose = useMemo(() => {
    let p = sanitizeLearnerText(blueprint.purpose);
    // Strip leading title repeat inside purpose paragraph if present
    if (cleanSopTitle && p.toLowerCase().startsWith(cleanSopTitle.toLowerCase())) {
      p = p.slice(cleanSopTitle.length).replace(/^[\s.:–—-]+/, '').trim();
    }
    if (!p || isDuplicateLearnerCopy(cleanSopTitle, p)) {
      return `Execute ${cleanSopTitle} with clear verification gates, accurate sequence, and immediate escalation when an exception occurs.`;
    }
    return p;
  }, [blueprint.purpose, cleanSopTitle]);

  const welcomeSlide = useMemo(() => {
    const firstSlide = plan.slides?.[0];
    if (firstSlide && firstSlide.type === 'WELCOME') return firstSlide;
    return {
      type: 'WELCOME' as const,
      tag: `${cleanRole} · Training Deck`,
      title: cleanSopTitle,
      role: `Role: ${cleanRole}`,
      content: cleanPurpose,
      cta: 'Start Training Deck',
    };
  }, [plan.slides, cleanRole, cleanSopTitle, cleanPurpose]);

  // Cover Card Photo for Gamma Scroll Mode
  const heroPhotoUrl = useMemo(() => {
    const match = findBestVisualMatch(
      `${cleanSopTitle} ${cleanRole} ${cleanPurpose}`,
      cleanSopTitle
    );
    return (
      welcomeSlide.img ||
      match.url ||
      '/Guruji_Real_Photo_Visual_Library_500/002_retail_cashier_scanning_product.webp'
    );
  }, [cleanSopTitle, cleanRole, cleanPurpose, welcomeSlide]);

  if (currentIndex === 0 && viewMode === 'single_slide') {
    return (
      <div className="fixed inset-0 z-40 w-full h-dvh bg-[#ECE8DF] text-[#181F26] flex flex-col overflow-hidden">
        <WelcomePage
          slide={welcomeSlide}
          onNext={() => setCurrentIndex(1)}
          slideIndex={0}
          totalSlides={totalSlides}
          onClose={onClose}
        />
      </div>
    );
  }

  if (!activeAdaptiveSlide) return null;

  const isLastSlide = currentIndex === totalSlides - 1;

  const handleJumpToSlide = (targetIdx: number) => {
    setCurrentIndex(targetIdx);
    if (viewMode === 'gamma_scroll' && cardRefs.current[targetIdx]) {
      cardRefs.current[targetIdx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-40 w-full h-dvh bg-[#ECE8DF] text-[#181F26] flex flex-col overflow-hidden font-sans select-none">
      {/* Top Editorial Header Bar - Clean, Uncluttered Gamma Chrome */}
      <header className="relative z-30 h-14 px-4 sm:px-8 border-b border-[#D8D2C5] flex items-center justify-between gap-4 shrink-0 bg-[#F6F4EE]/95 backdrop-blur-md">
        <div className="flex items-center gap-3.5 min-w-0">
          {onClose && (
            <button
              onClick={onClose}
              className="h-8 px-3 bg-[#E5E0D5] hover:bg-[#DAD3C5] text-[#181F26] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>← Library</span>
            </button>
          )}
          <div className="truncate flex items-center gap-2.5">
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-[#C84B11] font-bold shrink-0">
              {cleanRole}
            </span>
            <span className="hidden sm:inline-block text-[#C5BEB0]">·</span>
            <span className="text-sm font-extrabold text-[#181F26] truncate block">
              {cleanSopTitle}
            </span>
          </div>
        </div>

        {/* Center Minimal Progress Track (Replaces Cluttered Backend Tag Buttons) */}
        <div className="hidden md:flex items-center gap-1.5">
          {adaptiveSlides.map((s, idx) => {
            const targetIdx = idx + 1;
            const isCurrent = targetIdx === currentIndex;
            return (
              <button
                key={s.unitId}
                onClick={() => handleJumpToSlide(targetIdx)}
                title={`${idx + 1}. ${sanitizeLearnerText(s.title)}`}
                className={`h-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'w-7 bg-[#C84B11]'
                    : 'w-2.5 bg-[#CFC8B8] hover:bg-[#364958]'
                }`}
              />
            );
          })}
        </div>

        {/* Right Mode Toggle (Deck Scroll vs Slide View) + Counter */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex bg-[#E5E0D5] p-0.5 border border-[#D5CFC0]">
            <button
              onClick={() => setViewMode('gamma_scroll')}
              className={`px-3 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                viewMode === 'gamma_scroll'
                  ? 'bg-[#364958] text-white'
                  : 'text-[#3A434C] hover:text-[#181F26]'
              }`}
            >
              Deck Scroll
            </button>
            <button
              onClick={() => setViewMode('single_slide')}
              className={`px-3 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                viewMode === 'single_slide'
                  ? 'bg-[#364958] text-white'
                  : 'text-[#3A434C] hover:text-[#181F26]'
              }`}
            >
              Slide View
            </button>
          </div>

          <span className="font-mono text-[11px] font-bold text-[#364958] bg-[#E5E0D5] px-2.5 py-1 border border-[#D5CFC0]">
            {currentIndex} / {adaptiveSlides.length}
          </span>
        </div>
      </header>

      {/* Main Editorial Viewport */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
        {viewMode === 'gamma_scroll' ? (
          /* ============================================================== *
           * GAMMA CONTINUOUS EDITORIAL FEED                                *
           * ============================================================== */
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 pb-16">
            {/* Card 0: Full-Bleed Hero Cover Card at Top of Deck */}
            <div className="w-full overflow-hidden border border-[#DCD6C8] shadow-[0_10px_36px_rgba(26,33,41,0.08)] bg-[#FBF9F5] relative min-h-[340px] sm:min-h-[390px] flex items-center">
              <img
                src={heroPhotoUrl}
                alt={cleanSopTitle}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#181F26]/65 via-[#181F26]/25 to-transparent pointer-events-none" />
              <div className="relative z-10 m-5 sm:m-10 lg:m-12 w-full max-w-xl bg-[#FBF9F5]/95 backdrop-blur-md p-7 sm:p-9 lg:p-10 border border-[#DCD6C8] shadow-xl">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C84B11] font-bold mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C84B11] inline-block shrink-0" />
                  <span>{cleanRole.toUpperCase()} · TRAINING BRIEFING</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-[#181F26] leading-[1.15] pb-4 border-b-[1.5px] border-[#1E252B]">
                  {cleanSopTitle}
                </h1>
                <p className="mt-4 text-sm sm:text-[15px] text-[#2E3740] leading-relaxed">
                  {cleanPurpose}
                </p>
              </div>
            </div>

            {/* Cards 1..N: Every Story-Ordered Editorial Card */}
            {adaptiveSlides.map((slide, idx) => {
              const slideIdx = idx + 1;
              return (
                <div
                  key={slide.unitId}
                  ref={(el) => {
                    cardRefs.current[slideIdx] = el;
                  }}
                  onMouseEnter={() => setCurrentIndex(slideIdx)}
                >
                  <GammaEditorialSlideCard
                    slide={slide}
                    aiPhotoUrl={aiSlidePhotos[slide.num] || null}
                    selectedOptionId={selectedOptions[slide.unitId] || null}
                    onSelectOption={(id) =>
                      setSelectedOptions((prev) => ({ ...prev, [slide.unitId]: id }))
                    }
                    checkedItems={checkedItems}
                    onToggleCheck={(key) =>
                      setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    onComplete={onComplete}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* ============================================================== *
           * FOCUSED SINGLE-SLIDE VIEW                                      *
           * ============================================================== */
          <div className="max-w-4xl mx-auto py-2">
            <GammaEditorialSlideCard
              slide={activeAdaptiveSlide}
              aiPhotoUrl={aiSlidePhotos[activeAdaptiveSlide.num] || null}
              selectedOptionId={selectedOptions[activeAdaptiveSlide.unitId] || null}
              onSelectOption={(id) =>
                setSelectedOptions((prev) => ({ ...prev, [activeAdaptiveSlide.unitId]: id }))
              }
              checkedItems={checkedItems}
              onToggleCheck={(key) =>
                setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              onComplete={onComplete}
            />
          </div>
        )}
      </main>

      {/* Bottom Editorial Action Bar */}
      <footer className="relative z-30 h-16 px-4 sm:px-8 border-t border-[#D8D2C5] bg-[#F6F4EE] flex items-center justify-between gap-4 shrink-0">
        <button
          onClick={() => {
            if (viewMode === 'gamma_scroll') {
              if (currentIndex <= 1 && onClose) {
                onClose();
              } else {
                handleJumpToSlide(Math.max(1, currentIndex - 1));
              }
            } else {
              const prevIdx = Math.max(0, currentIndex - 1);
              handleJumpToSlide(prevIdx);
            }
          }}
          className="px-4 py-2.5 bg-[#E5E0D5] hover:bg-[#DAD3C5] text-[#181F26] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          ← Previous
        </button>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#5A626A]">
          <span>{sanitizeLearnerText(activeAdaptiveSlide.gammaKicker || activeAdaptiveSlide.layoutName)}</span>
        </div>

        <button
          onClick={() => {
            if (viewMode === 'gamma_scroll' || isLastSlide) {
              if (onComplete) onComplete();
              else if (onClose) onClose();
            } else {
              handleJumpToSlide(Math.min(totalSlides - 1, currentIndex + 1));
            }
          }}
          className="px-6 py-2.5 bg-[#C84B11] hover:bg-[#AD3E0B] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>
            {viewMode === 'gamma_scroll' || isLastSlide ? 'Launch Floor Simulation →' : 'Next Card →'}
          </span>
        </button>
      </footer>
    </div>
  );
};
