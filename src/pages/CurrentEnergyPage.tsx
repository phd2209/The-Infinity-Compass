/**
 * CurrentEnergyPage
 *
 * The "instant payoff" page showing user's current numerology energy period.
 * This is the most important page for viral sharing and return visits.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Sparkles, Loader2, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateNumerologyData, getCompoundNumberInterpretation } from '@/utils/numerology';
import {
  calculateYearPeriods,
  getPeriodTitle,
  getCurrentPeriodIndex,
  extractNumericValue,
  reduceNumber,
  calculateColumnNumber,
  type YearPeriodCalculation,
} from '@/services/yearSeriesService';
import { generateEnergyCard } from '@/services/energyCardService';
import { useLanguage } from '@/context/LanguageContext';
import { CountdownTimer } from '@/components/CountdownTimer';
import html2canvas from 'html2canvas-pro';

interface CurrentEnergyPageProps {
  userData: {
    name: string;
    birthDate: Date;
    focusArea: string;
  };
}

export default function CurrentEnergyPage({ userData }: CurrentEnergyPageProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentPeriodNumber, setCurrentPeriodNumber] = useState<string>('');
  const [currentPeriodTitle, setCurrentPeriodTitle] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [actionTip, setActionTip] = useState<string>('');
  const [nextEnergyDate, setNextEnergyDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Energy card AI generation state
  const [energyCardUrl, setEnergyCardUrl] = useState<string | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [, setCardGenerationError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [includeName, setIncludeName] = useState(() => {
    return localStorage.getItem('includeNameInEnergyCard') === 'true';
  });

  const { name, birthDate } = userData;

  useEffect(() => {
    const initializeCurrentEnergy = async () => {
      setLoading(true);

      try {
        // Calculate numerology data
        const numerologyData = calculateNumerologyData(name, birthDate);

        // Calculate column number
        const columnData = calculateColumnNumber({
          top: numerologyData.diamond_upper_value,
          bottom: extractNumericValue(numerologyData.diamond_lower_value),
          upperCircle: numerologyData.diamond_upper_circle.filter(v => v !== undefined).map(extractNumericValue),
          upperLowerCircle: numerologyData.diamond_upper_lower_circle.filter(v => v !== undefined).map(extractNumericValue),
          lowerCircle: numerologyData.diamond_lower_circle.filter(v => v !== undefined).map(extractNumericValue),
          lowerLowerCircle: numerologyData.diamond_lower_lower_circle.filter(v => v !== undefined).map(extractNumericValue),
          midNameValues: numerologyData.midNameValues.filter(v => v !== undefined).map(extractNumericValue),
        });

        const topDiamond = numerologyData.diamond_upper_value;
        const bottomDiamond = reduceNumber(extractNumericValue(numerologyData.diamond_lower_value));
        const columnNumber = columnData.reduced;
        const birthYear = birthDate.getFullYear();
        const currentYear = new Date().getFullYear();

        // Calculate year periods
        const forecast: YearPeriodCalculation = calculateYearPeriods(
          currentYear,
          topDiamond,
          bottomDiamond,
          birthYear,
          columnNumber
        );

        // Get current period index
        const today = new Date();
        const currentPeriodIdx = getCurrentPeriodIndex(today, forecast.periodCount);

        // Get current period data
        const currentPeriod = forecast.periods[currentPeriodIdx];

        setCurrentPeriodNumber(currentPeriod?.number?.display || 'N/A');

        // Get title, shortDescription and actionTip from compound number interpretation
        let title = 'Unknown';
        let shortDesc = t.currentSeasonText;
        let action = '';

        if (currentPeriod) {
          const compoundInterpretation = getCompoundNumberInterpretation(currentPeriod.number.display);
          if (compoundInterpretation) {
            // Use Danish or English based on language setting
            title = language === 'da' && compoundInterpretation.captionDa
              ? compoundInterpretation.captionDa
              : compoundInterpretation.caption;

            // Use short description if available, otherwise fall back to full description
            shortDesc = language === 'da'
              ? (compoundInterpretation.shortDescriptionDa || compoundInterpretation.descriptionDa || compoundInterpretation.shortDescription || compoundInterpretation.description)
              : (compoundInterpretation.shortDescription || compoundInterpretation.description);

            // Get action tip
            action = language === 'da'
              ? (compoundInterpretation.actionTipDa || compoundInterpretation.actionTip || '')
              : (compoundInterpretation.actionTip || '');
          } else {
            title = getPeriodTitle(currentPeriod.number.value);
          }
        }
        setCurrentPeriodTitle(title);
        setShortDescription(shortDesc);
        setActionTip(action);

        // Set the end date for countdown timer (next energy starts)
        if (currentPeriod) {
          const periodEndDate = new Date(currentPeriod.endDate);
          // Add one day since the period ends at midnight
          periodEndDate.setDate(periodEndDate.getDate() + 1);
          setNextEnergyDate(periodEndDate);
        } else {
          setNextEnergyDate(null);
        }

      } catch (error) {
        console.error('Error calculating current energy:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeCurrentEnergy();
  }, [name, birthDate, language, t.currentSeasonText]);

  // Generate energy card when we have the period data
  useEffect(() => {
    const generateCard = async () => {
      if (!currentPeriodNumber || !currentPeriodTitle || loading) return;

      // Get English caption for consistent image generation
      const compoundInterpretation = getCompoundNumberInterpretation(currentPeriodNumber);
      const englishCaption = compoundInterpretation?.caption || currentPeriodTitle;
      const englishDescription = compoundInterpretation?.shortDescription || compoundInterpretation?.description || shortDescription;

      // Check localStorage cache first to avoid showing loading state unnecessarily
      const cacheKey = `energy_card_${currentPeriodNumber.replace('/', '_')}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const { imageUrl, timestamp } = JSON.parse(cachedData);
          const cacheAge = Date.now() - timestamp;
          const MAX_CACHE_AGE = 1 * 60 * 60 * 1000; // 1 hour

          if (cacheAge < MAX_CACHE_AGE && imageUrl) {
            console.log('Using cached energy card from localStorage (no loading spinner)');
            setEnergyCardUrl(imageUrl);
            return; // Skip generation entirely
          }
        } catch {
          // Cache invalid, continue to generate
        }
      }

      // No valid cache - show loading state and generate
      setIsGeneratingCard(true);
      setCardGenerationError(null);

      try {
        const result = await generateEnergyCard(
          currentPeriodNumber,
          englishCaption,
          englishDescription
        );
        setEnergyCardUrl(result.imageUrl);
      } catch (error) {
        console.error('Failed to generate energy card:', error);
        setCardGenerationError('Failed to generate card artwork');
      } finally {
        setIsGeneratingCard(false);
      }
    };

    generateCard();
  }, [currentPeriodNumber, currentPeriodTitle, loading, shortDescription]);

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
        onclone: (clonedDoc) => {
          // Remove backdrop-blur effects
          const backdropElements = clonedDoc.querySelectorAll('[class*="backdrop-blur"]');
          backdropElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.backdropFilter = 'none';
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

          // Ensure energy number is visible with explicit styling
          const energyNumber = clonedDoc.querySelector('.energy-number');
          if (energyNumber) {
            const htmlEl = energyNumber as HTMLElement;
            htmlEl.style.color = '#FFFFFF';
            htmlEl.style.opacity = '1';
            htmlEl.style.visibility = 'visible';
            htmlEl.style.textShadow = '0 0 10px rgba(248,161,209,0.5)';
          }
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
    a.download = `${name}-current-energy.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareToX = async () => {
    const shareText = `My current energy: ${currentPeriodNumber} - "${currentPeriodTitle}" ✨\n\nDiscover your cosmic energy at theinfinitycompass.com`;

    // Mobile share with image
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        const blob = await handleGenerateImage();
        if (!blob) return;

        const file = new File([blob], 'current-energy.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            text: shareText,
            files: [file]
          });
          return;
        }
      } catch (error) {
        console.log('Web Share API with image failed:', error);
      }
    }

    // Desktop fallback: Copy image to clipboard + open Twitter
    const blob = await handleGenerateImage();
    if (!blob) return;

    const text = encodeURIComponent(shareText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

    try {
      if (navigator.clipboard && ClipboardItem) {
        const clipboardItem = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([clipboardItem]);

        window.open(twitterUrl, '_blank', 'width=550,height=420');

        setTimeout(() => {
          alert('✨ Image copied to clipboard!\n\nPaste it (Ctrl+V / Cmd+V) into the Twitter composer to attach it.');
        }, 300);
        return;
      }
    } catch (clipboardError) {
      console.log('Clipboard API failed:', clipboardError);
    }

    // Final fallback: Download image + open Twitter
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-current-energy.png`;
    a.click();
    URL.revokeObjectURL(url);

    window.open(twitterUrl, '_blank', 'width=550,height=420');

    setTimeout(() => {
      alert('📥 Image downloaded!\n\nClick the image icon in the Twitter composer to attach it to your tweet.');
    }, 500);
  };

  const handleShareToInstagram = async () => {
    const blob = await handleGenerateImage();
    if (!blob) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share && navigator.canShare({ files: [new File([blob], 'energy.png', { type: 'image/png' })] })) {
      try {
        await navigator.share({
          files: [new File([blob], 'current-energy.png', { type: 'image/png' })],
          title: 'My Current Energy',
          text: `My current energy: ${currentPeriodNumber} - "${currentPeriodTitle}" ✨`
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Desktop or Web Share not available - download instead
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}-current-energy.png`;
      a.click();
      URL.revokeObjectURL(url);

      alert('📥 Image downloaded!\n\nOpen Instagram and create a new post to share your energy card.');
    }
  };

  const handleNameToggle = () => {
    const newValue = !includeName;
    setIncludeName(newValue);
    localStorage.setItem('includeNameInEnergyCard', String(newValue));
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#9B8DE3] animate-spin mx-auto mb-4" />
          <p className="text-[#F4E8DC]/70" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Calculating your current energy...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-6 px-4 relative overflow-hidden">
      {/* Cosmic particles */}
      <div className="cosmic-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <img
            src="/logo_transp.png"
            alt="The Infinity Compass"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#9B8DE3] via-[#F8A1D1] to-[#6BCFF6] bg-clip-text text-transparent"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {t.appTitle}
          </h1>
          <p
            className="text-[#F4E8DC]/60 text-sm md:text-base italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t.currentEnergySubtitle}
          </p>
        </motion.div>

        {/* Share and Download buttons - above card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 justify-end mb-4"
        >
          <Button
            onClick={handleShare}
            disabled={isGeneratingImage}
            className="bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {language === 'da' ? 'Del' : 'Share'}
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
        </motion.div>

        {/* Shareable Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/90 to-[#0C0A1E]/90 border-[#9B8DE3]/40 rounded-3xl p-6 md:p-8 shadow-2xl mb-4"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#9B8DE3] via-[#F8A1D1] to-[#6BCFF6] bg-clip-text text-transparent mb-1"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {t.currentEnergyTitle}
            </motion.h1>
            {includeName && (
              <p className="text-[#F4E8DC]/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {name}
              </p>
            )}
          </div>

          {/* Energy Card Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center mb-4"
          >
            {/* AI-Generated Tarot Card or Loading State */}
            <div className="relative mx-auto mb-4" style={{ maxWidth: '280px' }}>
              {isGeneratingCard ? (
                // Loading state - show animated placeholder
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#1D1B3A] to-[#0C0A1E] border border-[#9B8DE3]/40 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-[#9B8DE3]/30 border-t-[#F8A1D1] animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-[#6BCFF6]/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                  <p className="text-[#F4E8DC]/60 text-sm mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Creating your energy card...
                  </p>
                  <p className="text-[#F4E8DC]/40 text-xs mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    This may take 10-20 seconds
                  </p>
                </div>
              ) : energyCardUrl ? (
                // AI-generated card with text overlay
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(155,141,227,0.3)]">
                  {/* Background Image */}
                  <img
                    src={energyCardUrl}
                    alt="Energy Card"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => {
                      // Image failed to load (expired URL), clear cache and fallback
                      console.log('Energy card image failed to load, clearing cache');
                      const cacheKey = `energy_card_${currentPeriodNumber.replace('/', '_')}`;
                      localStorage.removeItem(cacheKey);
                      setEnergyCardUrl(null);
                    }}
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Text overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <span
                      className="energy-number text-4xl md:text-5xl font-bold block mb-1"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: '#FFFFFF',
                        textShadow: '0 0 20px rgba(248,161,209,0.8), 0 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      {currentPeriodNumber}
                    </span>
                    <h2
                      className="text-lg md:text-xl font-semibold"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: '#F8A1D1',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      "{currentPeriodTitle}"
                    </h2>
                  </div>

                </div>
              ) : (
                // Fallback: Original circle design if card generation fails
                <div className="flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 md:w-36 md:h-36 rounded-full bg-[#0C0A1E] border-2 border-[#9B8DE3]/60 shadow-[0_0_30px_rgba(155,141,227,0.3)] mb-3">
                    <span
                      className="energy-number text-5xl md:text-6xl font-bold"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: '#FFFFFF',
                        textShadow: '0 0 10px rgba(248,161,209,0.5)'
                      }}
                    >
                      {currentPeriodNumber}
                    </span>
                  </div>
                  <h2
                    className="text-xl md:text-2xl font-semibold text-[#F8A1D1] mb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    "{currentPeriodTitle}"
                  </h2>
                </div>
              )}
            </div>

            {/* Description - shown below card */}
            <p className="text-[#F4E8DC]/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {shortDescription}
            </p>

            {/* Action Tip - Oracle Quote Style */}
            {actionTip && (
              <div className="max-w-md mx-auto text-center mt-2">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-[#9B8DE3]/40">───</span>
                  <span className="text-[#F8A1D1]">✦</span>
                  <span className="text-[#9B8DE3]/40">───</span>
                </div>
                <p
                  className="text-[#F4E8DC]/80 text-base md:text-lg leading-relaxed italic px-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  "{actionTip}"
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="text-[#9B8DE3]/40">───</span>
                  <span className="text-[#F8A1D1]">✦</span>
                  <span className="text-[#9B8DE3]/40">───</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Live Countdown Timer - Outside card for clean download/share */}
        {nextEnergyDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <CountdownTimer targetDate={nextEnergyDate} />
          </motion.div>
        )}

        {/* Complete Profile - Full width, emphasized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate('/share')}
            className="w-full bg-gradient-to-r from-[#F8A1D1] to-[#9B8DE3] hover:from-[#E891C1] hover:to-[#8B7DD3] text-white h-14 text-base shadow-lg shadow-[#9B8DE3]/20"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t.seeCompleteProfile}
          </Button>
        </motion.div>

        {/* Include Name Checkbox */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <label className="flex items-center gap-3 cursor-pointer bg-black/40 px-6 py-3 rounded-xl border border-[#9B8DE3]/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
            <input
              type="checkbox"
              checked={includeName}
              onChange={handleNameToggle}
              className="w-5 h-5 rounded accent-[#9B8DE3]"
            />
            <span className="text-[#F4E8DC] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {language === 'da' ? 'Inkluder mit navn i kortet' : 'Include my name in the card'}
            </span>
          </label>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#1D1B3A] to-[#0C0A1E] p-8 rounded-2xl border border-[#9B8DE3]/40 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-[#F4E8DC] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                {language === 'da' ? 'Del Dit Energikort' : 'Share Your Energy Card'}
              </h3>

              <div className="space-y-4">
                <Button
                  onClick={handleShareToX}
                  disabled={isGeneratingImage}
                  className="w-full bg-black hover:bg-black/80 text-white flex items-center justify-center gap-3 py-6"
                >
                  {isGeneratingImage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Twitter className="w-5 h-5" />
                  )}
                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>{language === 'da' ? 'Del på X (Twitter)' : 'Share on X (Twitter)'}</span>
                </Button>

                <Button
                  onClick={handleShareToInstagram}
                  disabled={isGeneratingImage}
                  className="w-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white flex items-center justify-center gap-3 py-6"
                >
                  {isGeneratingImage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Instagram className="w-5 h-5" />
                  )}
                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>{language === 'da' ? 'Del på Instagram' : 'Share on Instagram'}</span>
                </Button>

                <Button
                  onClick={handleDownload}
                  disabled={isGeneratingImage}
                  variant="outline"
                  className="w-full bg-black/20 border-[#9B8DE3] text-[#F4E8DC] hover:bg-[#9B8DE3]/30 flex items-center justify-center gap-3 py-6"
                >
                  {isGeneratingImage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>{language === 'da' ? 'Download Billede' : 'Download Image'}</span>
                </Button>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="mt-6 w-full text-[#F4E8DC]/60 hover:text-[#F4E8DC] text-sm transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {language === 'da' ? 'Luk' : 'Close'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
