import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image?: string;
  isLast?: boolean;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Welcome to the Infinity Compass demo ✨',
    subtitle: "See how safe and simple your cosmic journey is — no login needed.",
    image: '/demo/fortune-teller.png',
  },
  {
    id: 2,
    title: 'Step 1: Connect safely with Discord',
    subtitle:
      'We use Discord authentication solely to verify you\'re a World of Women or World of Women Galaxy holder',
    image: '/demo/discord-auth.PNG',
  },
  {
    id: 3,
    title: 'Step 2a: Enter your wallet address',
    subtitle: 'Paste in your wallet address and we\'ll show you all your WoW/WoWG NFTs - no wallet connection needed!',
    image: '/demo/nft-selection.PNG',
  },
  {
    id: 4,
    title: 'Step 2b: Enter your details for the reading',
    subtitle: 'Choose your WoW NFT and provide your name & birth date for numerology',
    image: '/demo/nft-selection_1.PNG',
  },
  {
    id: 5,
    title: 'Step 3: Reveal your personalized reading',
    subtitle: "Powered by ancient numerology + your NFT's unique energy 🔮",
    image: '/demo/reading-sample.PNG',
    isLast: true,
  },
];

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onOpenChange(false);
  };

  const handleGetStarted = () => {
    handleClose();
    // Optional: Scroll to Discord button or trigger login
    const loginButton = document.querySelector('[data-discord-login]');
    if (loginButton) {
      loginButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const currentSlideData = slides[currentSlide];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-md">
          {/* Logo positioned same as login page */}
          <div className="absolute top-0 left-0 right-0 flex justify-center pt-[93px] pointer-events-none">
            <img
              src="/logo_transp.png"
              alt="The Infinity Compass"
              className="h-44 w-auto opacity-40"
            />
          </div>

          {/* Cosmic particles in backdrop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.2,
                }}
                animate={{
                  opacity: [
                    Math.random() * 0.3 + 0.2,
                    Math.random() * 0.7 + 0.3,
                    Math.random() * 0.3 + 0.2,
                  ],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </DialogOverlay>
        <DialogContent
          className="max-w-[700px] border-0 bg-transparent p-0 shadow-none"
          onEscapeKeyDown={handleClose}
        >
          {/* Custom close button */}
          <button
            onClick={handleClose}
            className="absolute -right-12 top-0 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20 hover:scale-110 z-50"
            aria-label="Close demo"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal container with cosmic styling */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#150028] to-[#2b0045] p-8 shadow-[0_0_60px_rgba(155,141,227,0.4)]">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff67d4] via-[#9a4bff] to-[#ff67d4] opacity-30 blur-sm -z-10" />

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#9a4bff]/20 rounded-full blur-3xl -z-10" />

            {/* Slide content */}
            <div className="relative min-h-[500px] flex flex-col">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Title */}
                  <h2
                    className="text-2xl font-bold text-white mb-4"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {currentSlideData.title}
                  </h2>

                  {/* Subtitle */}
                  <p
                    className="text-base text-gray-300 mb-6 whitespace-pre-line leading-relaxed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {currentSlideData.subtitle}
                  </p>

                  {/* Image placeholder */}
                  {currentSlideData.image && (
                    <div className="w-full h-80 mb-6 rounded-lg overflow-hidden border-2 border-white/10 bg-black/30">
                      <img
                        src={currentSlideData.image}
                        alt={`Demo step ${currentSlide + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback if image doesn't exist yet
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className =
                              'placeholder w-full h-full flex items-center justify-center text-white/50';
                            placeholder.textContent = 'Screenshot will appear here';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex justify-center gap-3 mt-auto mb-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentSlide ? 1 : -1);
                      setCurrentSlide(index);
                    }}
                    className={`relative transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-3 h-3'
                        : 'w-2 h-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {/* Active dot with circle around it */}
                    {index === currentSlide ? (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-[#ff67d4] animate-pulse" />
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-r from-[#ff67d4] to-[#9a4bff]" />
                      </>
                    ) : (
                      <div className="absolute inset-0 rounded-full bg-white/30 hover:bg-white/50 transition-colors" />
                    )}
                  </button>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                {/* Back button */}
                {currentSlide > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}

                {/* Next/Get Started button */}
                <Button
                  onClick={currentSlideData.isLast ? handleGetStarted : handleNext}
                  className={`${
                    currentSlide === 0 ? 'w-full' : 'flex-1'
                  } bg-gradient-to-r from-[#9a4bff] to-[#ff67d4] hover:from-[#8a3bef] hover:to-[#e857c4] text-white font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(155,141,227,0.5)] transition-all duration-300`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {currentSlideData.isLast ? (
                    'Get My Reading Now →'
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>

              {/* Skip button for first slides */}
              {currentSlide < slides.length - 1 && (
                <button
                  onClick={() => setCurrentSlide(slides.length - 1)}
                  className="mt-4 text-sm text-white/50 hover:text-white/80 transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Skip to end
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
