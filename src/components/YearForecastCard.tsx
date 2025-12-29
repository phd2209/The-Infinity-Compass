/**
 * YearForecastCard Component
 *
 * A shareable card that displays the year series numerology forecast.
 * Shows the periods for a given year with their numbers and date ranges.
 */

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Share2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  calculateYearPeriods,
  getPeriodTitle,
  getCurrentPeriodIndex,
  type YearPeriodCalculation,
} from '@/services/yearSeriesService';
import html2canvas from 'html2canvas-pro';

interface YearForecastCardProps {
  name: string;
  birthDate: Date;
  topDiamond: number;
  bottomDiamond: number;
  columnNumber: number;
  year?: number;
}

export default function YearForecastCard({
  name,
  birthDate,
  topDiamond,
  bottomDiamond,
  columnNumber,
  year: initialYear,
}: YearForecastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentYear, setCurrentYear] = useState(initialYear || new Date().getFullYear());

  const birthYear = birthDate.getFullYear();
  const forecast: YearPeriodCalculation = calculateYearPeriods(
    currentYear,
    topDiamond,
    bottomDiamond,
    birthYear,
    columnNumber
  );

  const today = new Date();
  const currentPeriodIndex = today.getFullYear() === currentYear
    ? getCurrentPeriodIndex(today, forecast.periodCount)
    : -1;

  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const getYearTypeLabel = (): string => {
    switch (forecast.yearType) {
      case 'regular': return 'Standard Year';
      case 'before_chart': return 'Transition Year';
      case 'chart_with_next': return 'Major Shift Year';
      case 'chart_without_next': return 'Breakthrough Year';
      default: return 'Year Forecast';
    }
  };

  const handleGenerateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    setIsGeneratingImage(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0C0A1E',
        useCORS: true,
        allowTaint: false,
        imageTimeout: 15000,
        foreignObjectRendering: false,
        logging: false,
        removeContainer: true,
        onclone: (clonedDoc, clonedElement) => {
          if (!clonedElement) return;

          // Remove backdrop-blur effects
          const backdropElements = clonedDoc.querySelectorAll('[class*="backdrop-blur"]');
          backdropElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.backdropFilter = 'none';
            // @ts-expect-error - webkitBackdropFilter
            htmlEl.style.webkitBackdropFilter = 'none';
          });

          // Fix bg-clip-text elements
          const bgClipTextElements = clonedDoc.querySelectorAll('[class*="bg-clip-text"]');
          bgClipTextElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.background = 'none';
            htmlEl.style.backgroundClip = 'unset';
            htmlEl.style.webkitBackgroundClip = 'unset';
            htmlEl.style.webkitTextFillColor = 'unset';
            htmlEl.style.color = '#F8A1D1';
            htmlEl.classList.remove('text-transparent');
          });
        }
      });

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownload = async () => {
    const blob = await handleGenerateImage();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-${currentYear}-forecast.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const blob = await handleGenerateImage();
    if (!blob) return;

    const shareText = `My ${currentYear} cosmic forecast - ${forecast.periodCount} periods of growth and transformation ✨\n\nDiscover your year ahead at https://infinitycompass.xyz`;

    // Mobile share with image
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      try {
        const file = new File([blob], 'forecast.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            text: shareText,
            files: [file]
          });
          return;
        }
      } catch (error) {
        console.log('Web Share API failed:', error);
      }
    }

    // Desktop fallback: copy to clipboard
    try {
      if (navigator.clipboard && ClipboardItem) {
        const clipboardItem = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([clipboardItem]);

        const text = encodeURIComponent(shareText);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');

        setTimeout(() => {
          alert('Image copied to clipboard! Paste it (Ctrl+V / Cmd+V) into the Twitter composer.');
        }, 300);
        return;
      }
    } catch (error) {
      console.log('Clipboard API failed:', error);
    }

    // Final fallback: download
    await handleDownload();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Year navigation */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentYear(y => y - 1)}
          className="bg-black/40 border-[#9B8DE3]/40 text-[#F4E8DC] hover:bg-[#9B8DE3]/20"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span
          className="text-2xl font-bold text-[#F4E8DC]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {currentYear}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentYear(y => y + 1)}
          className="bg-black/40 border-[#9B8DE3]/40 text-[#F4E8DC] hover:bg-[#9B8DE3]/20"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* The shareable card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden p-6"
        style={{
          background: 'linear-gradient(145deg, #0C0A1E 0%, #1D1B3A 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(155, 141, 227, 0.3)',
        }}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-[#9B8DE3]/5 to-[#F8A1D1]/5 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-[#9B8DE3]" />
              <span
                className="text-sm uppercase tracking-wider text-[#F4E8DC]/60"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {getYearTypeLabel()}
              </span>
            </div>
            <h2
              className="text-3xl font-bold bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] bg-clip-text text-transparent"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {currentYear} Forecast
            </h2>
            <p
              className="text-[#F4E8DC]/60 text-sm mt-1"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {name} • {forecast.periodCount} Periods
            </p>
          </div>

          {/* Periods grid */}
          <div className="space-y-2">
            {forecast.periods.map((period, index) => {
              const isCurrentPeriod = index === currentPeriodIndex;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all
                    ${isCurrentPeriod
                      ? 'bg-gradient-to-r from-[#9B8DE3]/30 to-[#F8A1D1]/30 border border-[#F8A1D1]/50'
                      : 'bg-[#1D1B3A]/50 border border-[#9B8DE3]/10'
                    }
                  `}
                >
                  {/* Period number display */}
                  <div
                    className={`
                      w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center font-bold
                      ${isCurrentPeriod
                        ? 'bg-gradient-to-br from-[#9B8DE3] to-[#F8A1D1] text-white shadow-lg shadow-[#9B8DE3]/40'
                        : 'bg-[#9B8DE3]/20 text-[#F4E8DC]'
                      }
                    `}
                  >
                    <span className="text-lg">{period.number.display}</span>
                  </div>

                  {/* Period info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${isCurrentPeriod ? 'text-[#F8A1D1]' : 'text-[#F4E8DC]'}`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {getPeriodTitle(period.number.value)}
                    </p>
                    <p
                      className="text-xs text-[#F4E8DC]/50"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {formatDateRange(period.startDate, period.endDate)}
                    </p>
                  </div>

                  {/* Current indicator */}
                  {isCurrentPeriod && (
                    <div className="flex-shrink-0">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#F8A1D1] text-white">
                        NOW
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#9B8DE3]/20 text-center">
            <p
              className="text-[#F4E8DC]/40 text-xs"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              infinitycompass.xyz
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <Button
          onClick={handleShare}
          disabled={isGeneratingImage}
          className="bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {isGeneratingImage ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4 mr-2" />
          )}
          Share
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isGeneratingImage}
          variant="outline"
          className="bg-black/40 border-[#9B8DE3]/40 text-[#F4E8DC] hover:bg-[#9B8DE3]/20"
        >
          {isGeneratingImage ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
