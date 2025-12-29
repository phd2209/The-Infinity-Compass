import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Download, Sparkles, Stars, Loader2, Twitter, Instagram, ChevronDown, Heart, Briefcase, TrendingUp, Star, Gem } from 'lucide-react';
import { calculateNumerologyData, type NumerologyData } from '@/utils/numerology';
import { generateNumerologySummary, type AISummary } from '@/services/aiService';
import { generateCosmicAvatar } from '@/services/avatarService';
import { useAuth } from '@/context/AuthContext';
import { getTalismanConfig, type TalismanConfig } from '@/services/talismanService';
import html2canvas from 'html2canvas-pro';

interface ShareableReadingPageProps {
  userData: {
    name: string;
    birthDate: Date;
    focusArea: string;
    gender?: 'woman' | 'man' | 'non-binary';
  };
  onBack?: () => void;
}

export interface DiamondData extends NumerologyData {
  top: number;
  bottom: string | number;
  left: string | number;
  center: string | number | null;
  center2?: string | number | null;
  right: string | number;
  up_mid_left: string | number;
  up_mid_center: string;
  up_mid_right: string | number;
  low_mid_left: string | number;
  low_mid_center: string;
  low_mid_right: string | number;
  details: Array<{
    Type: string;
    Number: string | number;
    Description: string;
  }>;
}

export default function ShareableReadingPage({ userData, onBack }: ShareableReadingPageProps) {
  const { selectedNFT, userPath, generatedAvatar, setGeneratedAvatar } = useAuth();
  const [readingData, setReadingData] = useState<DiamondData | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [includeName, setIncludeName] = useState(() => {
    return localStorage.getItem('includeNameInReading') === 'true';
  });
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [showSacredCrystal, setShowSacredCrystal] = useState(false);
  const [talismanConfig, setTalismanConfig] = useState<TalismanConfig | null>(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const initializationKey = useRef<string>('');

  const { name, birthDate } = userData;

  // Loading text messages that cycle
  const loadingMessages = [
    "Crafting your cosmic story...",
    "Consulting the stars...",
    "Reading the celestial patterns...",
    "Unveiling your sacred numbers...",
    "Channeling cosmic wisdom..."
  ];

  // Cycle through loading messages
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  // Get archetype title from AI summary with safety truncation
  const getArchetypeTitle = (): string => {
    const title = aiSummary?.archetype?.title || "The Cosmic Wanderer";
    // Ensure title doesn't exceed 30 characters for proper display
    if (title.length > 30) {
      // Try to truncate at a word boundary
      const truncated = title.substring(0, 27);
      const lastSpace = truncated.lastIndexOf(' ');
      return lastSpace > 15 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
    }
    return title;
  };

  useEffect(() => {
    console.log('ShareableReadingPage useEffect - userPath:', userPath, 'generatedAvatar:', generatedAvatar);

    const currentKey = `${name}-${birthDate.toISOString()}-${userData.focusArea}`;

    if (initializationKey.current === currentKey) {
      return;
    }

    // Set the key IMMEDIATELY to prevent double calls in React Strict Mode
    initializationKey.current = currentKey;

    const initializeReading = async () => {
      console.log('initializeReading called - userPath:', userPath, 'generatedAvatar:', generatedAvatar);
      const numerologyData = calculateNumerologyData(name, birthDate);

      const data: DiamondData = {
        ...numerologyData,
        top: numerologyData.diamond_upper_value,
        bottom: numerologyData.diamond_lower_value,
        left: numerologyData.nameValues[0],
        center: numerologyData.nameValues.length === 3 ? numerologyData.nameValues[1] :
                numerologyData.nameValues.length === 4 ? numerologyData.nameValues[1] : null,
        center2: numerologyData.nameValues.length === 4 ? numerologyData.nameValues[2] : null,
        right: numerologyData.nameValues[numerologyData.nameValues.length - 1],
        up_mid_left: numerologyData.diamond_upper_mid[0],
        up_mid_center: numerologyData.diamond_upper_lower_circle.length > 0 ?
                      `${numerologyData.diamond_upper_circle[0]} ${numerologyData.diamond_upper_lower_circle[0]}` :
                      numerologyData.diamond_upper_circle[0].toString(),
        up_mid_right: numerologyData.diamond_upper_mid[numerologyData.diamond_upper_mid.length - 1],
        low_mid_left: numerologyData.diamond_lower_mid[0],
        low_mid_center: numerologyData.diamond_lower_lower_circle.length > 0 ?
                       `${numerologyData.diamond_lower_circle[0]} ${numerologyData.diamond_lower_lower_circle[0]}` :
                       numerologyData.diamond_lower_circle[0].toString(),
        low_mid_right: numerologyData.diamond_lower_mid[numerologyData.diamond_lower_mid.length - 1],
        details: []
      };

      setReadingData(data);

      // Get talisman config based on Life Path number (top of diamond)
      const talisman = getTalismanConfig(data.top);
      setTalismanConfig(talisman);

      // Generate AI avatar for non-WoW users
      if (userPath === 'non-wow' && !generatedAvatar) {
        console.log('Generating cosmic avatar for non-WoW user with gender:', userData.gender, 'birthDate:', birthDate);
        setIsGeneratingAvatar(true);
        try {
          const avatarResult = await generateCosmicAvatar(numerologyData, false, userData.gender, birthDate);
          setGeneratedAvatar(avatarResult.imageUrl);
          console.log('Avatar generated successfully:', avatarResult.imageUrl);
        } catch (error) {
          console.error('Failed to generate avatar:', error);
          // Continue without avatar - will use fallback
        } finally {
          setIsGeneratingAvatar(false);
        }
      }

      try {
        const summary = await generateNumerologySummary(data, userData.focusArea);
        setAiSummary(summary);
      } catch (error) {
        console.error('Failed to generate AI summary:', error);
        setAiSummary({
          archetype: {
            title: "The Cosmic Wanderer",
            tagline: "You walk between worlds with wisdom and grace."
          },
          oneLiner: "Your cosmic blueprint reveals a natural leader with deep spiritual wisdom.",
          summary: "You are destined for significant personal transformation and growth. Your natural charisma attracts opportunities for leadership roles, and your intuitive gifts guide you through life's journey. Trust in your inner wisdom as it illuminates your path forward.",
          highlightWords: ["Leadership", "Wisdom", "Transformation", "Intuition", "Charisma"],
          visualCue: ["✨", "🌟", "🔮"]
        });
      }

      setLoading(false);
    };

    setTimeout(() => {
      initializeReading();
    }, 2500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, birthDate, userData.focusArea, userPath]);

  const handleNameToggle = () => {
    const newValue = !includeName;
    setIncludeName(newValue);
    localStorage.setItem('includeNameInReading', String(newValue));
  };

  const handleGenerateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    console.log('Starting image generation with html2canvas-pro...');
    setIsGeneratingImage(true);

    try {
      // Get the actual rendered dimensions
      const rect = cardRef.current.getBoundingClientRect();
      console.log('Card dimensions:', rect.width, 'x', rect.height);

      // html2canvas-pro configuration - optimized for compatibility
      const canvas = await html2canvas(cardRef.current, {
        // High quality rendering
        scale: 2,

        // Background color matching the card
        backgroundColor: '#0C0A1E',

        // CORS settings for NFT images
        useCORS: true,
        allowTaint: false,

        // Image loading timeout
        imageTimeout: 15000,

        // Disable foreign object rendering - it's causing empty renders
        foreignObjectRendering: false,

        // Logging for debugging
        logging: true,

        // Auto-cleanup
        removeContainer: true,

        // onclone callback - this is where we fix rendering issues
        onclone: (clonedDoc, clonedElement) => {
          console.log('Processing cloned document for rendering...');

          if (!clonedElement) return;

          // Remove backdrop-blur effects that html2canvas can't handle
          const backdropElements = clonedDoc.querySelectorAll('[class*="backdrop-blur"]');
          backdropElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.backdropFilter = 'none';
            // @ts-expect-error - webkitBackdropFilter is not in TypeScript's CSSStyleDeclaration but exists in browsers
            htmlEl.style.webkitBackdropFilter = 'none';
          });

          // Remove framer-motion transforms that might interfere
          const motionElements = clonedDoc.querySelectorAll('[style*="transform"]');
          motionElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.transform = 'none';
          });

          // Fix bg-clip-text elements (archetype title) - html2canvas doesn't support background-clip: text
          const bgClipTextElements = clonedDoc.querySelectorAll('[class*="bg-clip-text"]');
          bgClipTextElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            // Remove the transparent text and bg-clip, use gradient color instead
            htmlEl.style.background = 'none';
            htmlEl.style.backgroundClip = 'unset';
            htmlEl.style.webkitBackgroundClip = 'unset';
            htmlEl.style.webkitTextFillColor = 'unset';
            htmlEl.style.color = '#F8A1D1'; // Use the pink gradient color
            htmlEl.classList.remove('text-transparent');
          });

          // Fix flexbox layout for Core Qualities section - force horizontal layout
          const highlightSection = clonedDoc.querySelector('.flex.flex-col.md\\:flex-row.gap-6');
          if (highlightSection) {
            (highlightSection as HTMLElement).style.flexDirection = 'row';
            (highlightSection as HTMLElement).style.alignItems = 'center';
            (highlightSection as HTMLElement).style.justifyContent = 'space-between';
          }

          // Fix any absolutely positioned elements
          const absoluteElements = clonedDoc.querySelectorAll('[class*="absolute"]');
          absoluteElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const computed = getComputedStyle(htmlEl);
            // Keep position absolute but ensure visibility
            if (computed.opacity === '0') {
              htmlEl.style.opacity = '1';
            }
          });

          // Ensure card ref element is fully visible
          const cardElement = clonedDoc.querySelector('[data-card-ref="true"]');
          if (cardElement) {
            (cardElement as HTMLElement).style.position = 'relative';
            (cardElement as HTMLElement).style.display = 'block';
            (cardElement as HTMLElement).style.opacity = '1';
            (cardElement as HTMLElement).style.visibility = 'visible';
          }

          console.log('Cloned document processed successfully');
        }
      });

      console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

      // Convert canvas to blob with maximum quality
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('Blob created, size:', blob.size, 'bytes');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : String(error));
      alert(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for details.`);
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
    a.download = `${name}-numerology-reading.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareToX = async () => {
    const shareText = `"${aiSummary?.oneLiner || 'Discover your cosmic blueprint'}" — My Infinity Compass reading ✨\n\nExplore your cosmic blueprint at https://infinitycompass.xyz`;

    // Only use Web Share API on mobile devices (not desktop)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        const blob = await handleGenerateImage();
        if (!blob) return;

        const file = new File([blob], 'numerology-reading.png', { type: 'image/png' });

        // Check if we can share files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            text: shareText,
            files: [file]
          });
          return;
        }
      } catch (error) {
        console.log('Web Share API with image failed, falling back to clipboard:', error);
      }
    }

    // Desktop fallback: Copy image to clipboard + open Twitter
    const blob = await handleGenerateImage();
    if (!blob) return;

    // Prepare Twitter URL
    const text = encodeURIComponent(shareText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

    try {
      // Try to copy image to clipboard (modern browsers)
      if (navigator.clipboard && ClipboardItem) {
        const clipboardItem = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([clipboardItem]);

        // Open Twitter BEFORE showing alert (prevents popup blocking)
        window.open(twitterUrl, '_blank', 'width=550,height=420');

        // Show success message after window opens
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
    a.download = 'numerology-reading.png';
    a.click();
    URL.revokeObjectURL(url);

    // Open Twitter compose window with proper dimensions
    window.open(twitterUrl, '_blank', 'width=550,height=420');

    setTimeout(() => {
      alert('📥 Image downloaded!\n\nClick the image icon in the Twitter composer to attach it to your tweet.');
    }, 500);
  };

  const handleShareToInstagram = async () => {
    const blob = await handleGenerateImage();
    if (!blob) return;

    // Only use Web Share API on mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share && navigator.canShare({ files: [new File([blob], 'reading.png', { type: 'image/png' })] })) {
      try {
        await navigator.share({
          files: [new File([blob], 'reading.png', { type: 'image/png' })],
          title: 'My Infinity Compass Reading',
          text: `"${aiSummary?.oneLiner || 'Discover your cosmic blueprint'}" — My Infinity Compass reading ✨`
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Desktop or Web Share not available - download instead
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'numerology-reading.png';
      a.click();
      URL.revokeObjectURL(url);

      alert('📥 Image downloaded!\n\nOpen Instagram and create a new post to share your reading.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-5">
        {/* Fortune Teller Image - Larger and more prominent */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [0, -12, 0],
          }}
          transition={{
            scale: { duration: 0.6 },
            opacity: { duration: 0.6 },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="mb-8"
        >
          <img
            src="/fortune-teller-1.png"
            alt="Fortune Teller"
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-[0_0_35px_rgba(248,161,209,0.6)]"
          />
        </motion.div>

        {/* Animated Loading Text */}
        <AnimatePresence mode="wait">
          <motion.h6
            key={loadingTextIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-[#F4E8DC] text-xl sm:text-2xl text-center px-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {loadingMessages[loadingTextIndex]}
          </motion.h6>
        </AnimatePresence>

        {/* Subtle sparkle effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mt-6 flex gap-2"
        >
          <Sparkles className="w-5 h-5 text-[#9B8DE3]" />
          <Stars className="w-5 h-5 text-[#F8A1D1]" />
          <Sparkles className="w-5 h-5 text-[#9B8DE3]" />
        </motion.div>
      </div>
    );
  }

  if (!readingData || !aiSummary) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="min-h-screen gradient-bg py-8 px-4 relative overflow-hidden">
      {/* Cosmic particles */}
      <div className="cosmic-particles">
        {Array.from({ length: 30 }).map((_, i) => (
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

      {/* Header controls */}
      <div className="max-w-2xl mx-auto mb-6 relative z-20">
        <div className="flex justify-between items-center">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-black/40 border-[#9B8DE3]/40 text-[#F4E8DC] hover:bg-[#9B8DE3]/20"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ← Back
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button
              onClick={handleShare}
              disabled={isGeneratingImage}
              className="bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Share2 className="w-4 h-4 mr-2" />
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
      </div>

      {/* Main collectible card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <div
          ref={cardRef}
          data-card-ref="true"
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0C0A1E 0%, #1D1B3A 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(155, 141, 227, 0.3)',
          }}
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-[#9B8DE3]/10 to-[#F8A1D1]/10 pointer-events-none" />

          {/* NFT Integration Section - Hero */}
          <div className="relative">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: NFT Image or Generated Avatar */}
              {(selectedNFT || (userPath === 'non-wow' && (generatedAvatar || isGeneratingAvatar))) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative aspect-square md:aspect-auto"
                >
                  {isGeneratingAvatar ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1D1B3A] to-[#0C0A1E]">
                      <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 text-[#9B8DE3] animate-spin mx-auto" />
                        <p className="text-[#F4E8DC]/80 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Crafting your cosmic avatar...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={selectedNFT ? selectedNFT.imageUrl : generatedAvatar || '/placeholder-avatar.png'}
                        alt={selectedNFT ? selectedNFT.name : 'Your Cosmic Avatar'}
                        className="w-full h-full object-cover"
                      />
                      {/* NFT info overlay or AI Generated badge */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <div className="flex items-center gap-2">
                          {selectedNFT ? (
                            <>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  selectedNFT.collection === 'WoW'
                                    ? 'bg-[#9B8DE3] text-white'
                                    : 'bg-[#F8A1D1] text-white'
                                }`}
                              >
                                {selectedNFT.collection}
                              </span>
                              <span className="text-white text-sm font-medium">
                                #{selectedNFT.tokenId}
                              </span>
                            </>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] text-white flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI Generated Avatar
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Right: Reading Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-8 md:p-10 flex flex-col justify-center relative"
              >
                {/* Life Path Number - Large */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className="w-16 h-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#9B8DE3] to-[#F8A1D1] flex items-center justify-center shadow-lg shadow-[#9B8DE3]/50"
                    >
                      <span className="text-white font-bold text-3xl">{readingData.top}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#F4E8DC]/60 text-xs uppercase tracking-wide mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Life Path
                      </p>
                      <h2
                        className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] bg-clip-text text-transparent leading-snug"
                        style={{ fontFamily: "'Cinzel', serif", wordBreak: 'normal', overflowWrap: 'break-word' }}
                      >
                        {getArchetypeTitle()}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Name (optional) */}
                {includeName && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4"
                  >
                    <p className="text-[#F4E8DC] text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      — {name}
                    </p>
                  </motion.div>
                )}

                {/* One-liner essence */}
                <blockquote className="text-[#F4E8DC]/90 text-lg leading-relaxed italic border-l-4 border-[#9B8DE3] pl-4 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  "{aiSummary.oneLiner}"
                </blockquote>

                {/* Core numbers mini display */}
                <div className="flex gap-2">
                  {[readingData.left, readingData.center, readingData.right].filter(Boolean).map((num, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#9B8DE3]/30 to-[#F8A1D1]/30 flex items-center justify-center"
                    >
                      <span className="text-white font-bold text-sm">{num}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Insights Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 md:p-10 relative"
          >
            {/* Archetype Tagline */}
            {aiSummary.archetype?.tagline && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8 text-center"
              >
                <p
                  className="text-[#F8A1D1] text-xl italic font-light"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {aiSummary.archetype.tagline}
                </p>
              </motion.div>
            )}

            {/* Main Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Stars className="w-5 h-5 text-[#9B8DE3]" />
                <h3 className="text-[#F4E8DC] text-lg font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                  Your Essence
                </h3>
              </div>
              <p
                className="text-[#F4E8DC]/90 leading-relaxed text-base"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {aiSummary.summary}
              </p>
            </motion.div>

            {/* Highlight Words & Visual Cues */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col md:flex-row gap-6 items-center justify-between"
            >
              {/* Highlight Words */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#F8A1D1]" />
                  <h4 className="text-[#F4E8DC]/80 text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Core Qualities
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSummary.highlightWords.map((word: string, idx: number) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 + idx * 0.1 }}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-[#9B8DE3]/30 to-[#F8A1D1]/30 text-[#F4E8DC] text-xs font-medium"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Visual Cues */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="flex gap-3"
              >
                {aiSummary.visualCue.map((emoji: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-3xl"
                  >
                    {emoji}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Deep Dive Expandable Section */}
            {(aiSummary.loveStyle || aiSummary.careerGifts || aiSummary.spiritualGifts || aiSummary.growthPath || aiSummary.fortuneInsight) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="mt-8 pt-8 border-t border-[#9B8DE3]/20"
              >
                <button
                  onClick={() => setShowDeepDive(!showDeepDive)}
                  className="w-full flex items-center justify-between text-[#F4E8DC] hover:text-[#F8A1D1] transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#9B8DE3]" />
                    <span className="text-lg font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                      Deep Dive Insights
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showDeepDive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-[#9B8DE3] group-hover:text-[#F8A1D1]" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showDeepDive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {/* Love Style */}
                        {aiSummary.loveStyle && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-[#F8A1D1]" />
                              <h5 className="text-[#F4E8DC] text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Love & Relationships
                              </h5>
                            </div>
                            <p className="text-[#F4E8DC]/80 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {aiSummary.loveStyle}
                            </p>
                          </motion.div>
                        )}

                        {/* Career Gifts */}
                        {aiSummary.careerGifts && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-[#9B8DE3]" />
                              <h5 className="text-[#F4E8DC] text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Career Gifts
                              </h5>
                            </div>
                            <p className="text-[#F4E8DC]/80 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {aiSummary.careerGifts}
                            </p>
                          </motion.div>
                        )}

                        {/* Spiritual Gifts */}
                        {aiSummary.spiritualGifts && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#F8A1D1]" />
                              <h5 className="text-[#F4E8DC] text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Spiritual Gifts
                              </h5>
                            </div>
                            <p className="text-[#F4E8DC]/80 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {aiSummary.spiritualGifts}
                            </p>
                          </motion.div>
                        )}

                        {/* Growth Path */}
                        {aiSummary.growthPath && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-[#9B8DE3]" />
                              <h5 className="text-[#F4E8DC] text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Growth Path
                              </h5>
                            </div>
                            <p className="text-[#F4E8DC]/80 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {aiSummary.growthPath}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      {/* Compact Diamond Visualization */}
                      {readingData && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45 }}
                          className="mt-8 mb-6"
                        >
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <Stars className="w-4 h-4 text-[#9B8DE3]" />
                            <h5 className="text-[#F4E8DC] text-sm font-semibold text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              Your Sacred Numbers Diamond
                            </h5>
                            <Stars className="w-4 h-4 text-[#9B8DE3]" />
                          </div>

                          <div className="flex justify-center">
                            <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] aspect-square">
                              {/* SVG Diamond Shape with connecting lines */}
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                                <defs>
                                  {/* Gradient for diamond fill */}
                                  <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#9B8DE3', stopOpacity: 0.1 }} />
                                    <stop offset="50%" style={{ stopColor: '#F8A1D1', stopOpacity: 0.05 }} />
                                    <stop offset="100%" style={{ stopColor: '#9B8DE3', stopOpacity: 0.1 }} />
                                  </linearGradient>
                                  {/* Glow filter */}
                                  <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge>
                                      <feMergeNode in="coloredBlur"/>
                                      <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                  </filter>
                                </defs>

                                {/* Main Diamond Shape: Top -> Left -> Bottom -> Right -> Top */}
                                <path
                                  d="M 50,8 L 15,50 L 50,92 L 85,50 Z"
                                  fill="url(#diamondGradient)"
                                  stroke="#9B8DE3"
                                  strokeWidth="0.5"
                                  opacity="0.6"
                                  filter="url(#glow)"
                                />

                                {/* Inner lines from center to corners */}
                                <line x1="50" y1="8" x2="50" y2="50" stroke="#9B8DE3" strokeWidth="0.3" opacity="0.3" />
                                <line x1="15" y1="50" x2="50" y2="50" stroke="#F8A1D1" strokeWidth="0.3" opacity="0.3" />
                                <line x1="50" y1="50" x2="50" y2="92" stroke="#9B8DE3" strokeWidth="0.3" opacity="0.3" />
                                <line x1="50" y1="50" x2="85" y2="50" stroke="#F8A1D1" strokeWidth="0.3" opacity="0.3" />

                                {/* Diagonal lines to mid-points */}
                                <line x1="50" y1="8" x2="32.5" y2="29" stroke="#9B8DE3" strokeWidth="0.2" opacity="0.2" strokeDasharray="1,1" />
                                <line x1="50" y1="8" x2="67.5" y2="29" stroke="#F8A1D1" strokeWidth="0.2" opacity="0.2" strokeDasharray="1,1" />
                                <line x1="15" y1="50" x2="32.5" y2="71" stroke="#9B8DE3" strokeWidth="0.2" opacity="0.2" strokeDasharray="1,1" />
                                <line x1="85" y1="50" x2="67.5" y2="71" stroke="#F8A1D1" strokeWidth="0.2" opacity="0.2" strokeDasharray="1,1" />
                              </svg>

                              {/* Number Overlays - Positioned on diamond vertices */}
                              {/* Top */}
                              <div className="absolute top-[8%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-[#F4E8DC] bg-[#9B8DE3]/60 border-2 border-[#F4E8DC]/60 backdrop-blur-sm shadow-lg shadow-[#9B8DE3]/40">
                                {readingData.top}
                              </div>

                              {/* Left */}
                              <div className="absolute top-1/2 left-[15%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-[#F4E8DC] bg-[#F8A1D1]/60 border-2 border-[#F4E8DC]/60 backdrop-blur-sm shadow-lg shadow-[#F8A1D1]/40">
                                {readingData.left}
                              </div>

                              {/* Center - for 3-word names OR first center for 4-word names */}
                              {readingData.center && readingData.center !== 'N/A' && !readingData.center2 && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-[#F4E8DC] bg-gradient-to-br from-[#9B8DE3]/70 to-[#F8A1D1]/70 border-2 border-[#F4E8DC]/60 backdrop-blur-sm shadow-lg shadow-[#9B8DE3]/50">
                                  {readingData.center}
                                </div>
                              )}

                              {/* Two centers - for 4-word names, positioned horizontally on middle line */}
                              {readingData.center && readingData.center2 && (
                                <>
                                  {/* Left center */}
                                  <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs text-[#F4E8DC] bg-gradient-to-br from-[#9B8DE3]/70 to-[#F8A1D1]/70 border-2 border-[#F4E8DC]/60 backdrop-blur-sm shadow-lg shadow-[#9B8DE3]/50">
                                    {readingData.center}
                                  </div>
                                  {/* Right center */}
                                  <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs text-[#F4E8DC] bg-gradient-to-br from-[#9B8DE3]/70 to-[#F8A1D1]/70 border-2 border-[#F4E8DC]/60 backdrop-blur-sm shadow-lg shadow-[#9B8DE3]/50">
                                    {readingData.center2}
                                  </div>
                                </>
                              )}

                              {/* Right */}
                              <div className="absolute top-1/2 right-[15%] translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-[#F4E8DC] bg-[#F8A1D1]/60 border-2 border-[#F4E8DC]/60 backdrop-blur-sm shadow-lg shadow-[#F8A1D1]/40">
                                {readingData.right}
                              </div>

                              {/* Bottom */}
                              <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-[#F4E8DC] bg-[#9B8DE3]/60 border-2 border-[#F4E8DC]/60 backdrop-blur-sm shadow-lg shadow-[#9B8DE3]/40">
                                {readingData.bottom}
                              </div>

                              {/* Mid points - smaller and positioned along diamond edges */}
                              <div className="absolute top-[29%] left-[32.5%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-semibold text-[10px] sm:text-xs text-[#F4E8DC]/90 bg-[#9B8DE3]/40 border border-[#F4E8DC]/40 backdrop-blur-sm">
                                {readingData.up_mid_left}
                              </div>

                              <div className="absolute top-[29%] right-[32.5%] translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-semibold text-[10px] sm:text-xs text-[#F4E8DC]/90 bg-[#F8A1D1]/40 border border-[#F4E8DC]/40 backdrop-blur-sm">
                                {readingData.up_mid_right}
                              </div>

                              <div className="absolute bottom-[29%] left-[32.5%] -translate-x-1/2 translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-semibold text-[10px] sm:text-xs text-[#F4E8DC]/90 bg-[#9B8DE3]/40 border border-[#F4E8DC]/40 backdrop-blur-sm">
                                {readingData.low_mid_left}
                              </div>

                              <div className="absolute bottom-[29%] right-[32.5%] translate-x-1/2 translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-semibold text-[10px] sm:text-xs text-[#F4E8DC]/90 bg-[#F8A1D1]/40 border border-[#F4E8DC]/40 backdrop-blur-sm">
                                {readingData.low_mid_right}
                              </div>
                            </div>
                          </div>

                          <p className="text-[#F4E8DC]/60 text-xs text-center mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Your numerological blueprint visualized
                          </p>
                        </motion.div>
                      )}

                      {/* Fortune Insight - Full Width */}
                      {aiSummary.fortuneInsight && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#9B8DE3]/10 to-[#F8A1D1]/10 border border-[#9B8DE3]/20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-[#F8A1D1]" />
                            <h5 className="text-[#F4E8DC] text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              Cosmic Fortune
                            </h5>
                          </div>
                          <p className="text-[#F4E8DC]/80 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {aiSummary.fortuneInsight}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Sacred Crystal Section */}
            {talismanConfig && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-8 pt-8 border-t border-[#F8A1D1]/20"
              >
                <button
                  onClick={() => setShowSacredCrystal(!showSacredCrystal)}
                  className="w-full flex items-center justify-between text-[#F4E8DC] hover:text-[#F8A1D1] transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-[#F8A1D1]" />
                    <span className="text-lg font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                      Your Sacred Crystal
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showSacredCrystal ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-[#F8A1D1] group-hover:text-[#9B8DE3]" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showSacredCrystal && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 space-y-6">
                        {/* Crystal Image */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="flex justify-center"
                        >
                          <div className="relative w-48 h-48 md:w-56 md:h-56">
                            <img
                              src={talismanConfig.imageUrl}
                              alt={`${talismanConfig.crystal} Talisman`}
                              className="w-full h-full object-contain rounded-2xl"
                            />
                            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] text-white text-xs font-bold">
                              {talismanConfig.birthNumber}
                            </div>
                          </div>
                        </motion.div>

                        {/* Crystal Info */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-center space-y-3"
                        >
                          <h4
                            className="text-xl font-bold bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] bg-clip-text text-transparent"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {talismanConfig.crystal}
                          </h4>
                          <p className="text-[#F8A1D1] text-sm italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            The stone of {talismanConfig.meaning}
                          </p>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="p-4 rounded-xl bg-gradient-to-r from-[#9B8DE3]/10 to-[#F8A1D1]/10 border border-[#F8A1D1]/20"
                        >
                          <p className="text-[#F4E8DC]/90 text-sm leading-relaxed text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {talismanConfig.description}
                          </p>
                        </motion.div>

                        {/* Uniqueness Message */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-[#F4E8DC]/60 text-xs text-center italic"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          "Each crystal is hand-selected for its spiritual energy and natural beauty. The one that arrives is the one meant for you."
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center pt-2"
                        >
                          <Button
                            onClick={() => {
                              // TODO: Navigate to talisman page when implemented
                              console.log('Navigate to talisman page');
                            }}
                            className="bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white px-8 py-3 rounded-xl shadow-lg shadow-[#9B8DE3]/30"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            <Gem className="w-4 h-4 mr-2" />
                            Claim Your Talisman
                          </Button>
                        </motion.div>

                        {/* Material Info */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="flex justify-center gap-4 text-xs text-[#F4E8DC]/50"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <span>{talismanConfig.metalDisplay}</span>
                          <span>•</span>
                          <span>Natural Crystal</span>
                          <span>•</span>
                          <span>Certificate of Authenticity</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Name toggle control */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-2xl mx-auto mt-6 flex justify-center relative z-20"
      >
        <label className="flex items-center gap-3 cursor-pointer bg-black/40 px-6 py-3 rounded-xl border border-[#9B8DE3]/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
          <input
            type="checkbox"
            checked={includeName}
            onChange={handleNameToggle}
            className="w-5 h-5 rounded accent-[#9B8DE3]"
          />
          <span className="text-[#F4E8DC] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Include my name in the card
          </span>
        </label>
      </motion.div>

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
                Share Your Reading
              </h3>

              <div className="space-y-4">
                <Button
                  onClick={handleShareToX}
                  className="w-full bg-black hover:bg-black/80 text-white flex items-center justify-center gap-3 py-6"
                >
                  <Twitter className="w-5 h-5" />
                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>Share on X (Twitter)</span>
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
                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>Share on Instagram</span>
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
                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>Download Image</span>
                </Button>
              </div>

              <p className="text-[#F4E8DC]/60 text-xs text-center mt-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Your numerology reading aligned with your World of Women spirit ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
