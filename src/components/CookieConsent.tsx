import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GA_MEASUREMENT_ID = 'G-01D02EQTPJ';

// Function to load Google Analytics
const loadGoogleAnalytics = () => {
  // Create and append the GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');

    if (consent === 'accepted') {
      // User previously accepted - load GA4 immediately
      loadGoogleAnalytics();
    } else if (!consent) {
      // No choice made yet - show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
    // If consent === 'declined', do nothing (don't load GA4, don't show banner)
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    // Load GA4 now that user has accepted
    loadGoogleAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    // GA4 is never loaded, so nothing to disable
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1D1B3A]/95 to-[#0C0A1E]/95 backdrop-blur-lg border border-[#9B8DE3]/30 shadow-[0_0_40px_rgba(155,141,227,0.3)] p-5">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#9B8DE3]/5 via-[#F8A1D1]/5 to-[#9B8DE3]/5 pointer-events-none" />

            {/* Content */}
            <div className="relative flex items-start gap-4">
              {/* Cookie Icon */}
              <div className="flex-shrink-0 mt-1">
                <Cookie className="w-5 h-5 text-[#F8A1D1]" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p
                  className="text-sm text-[#F4E8DC]/90 leading-relaxed mb-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  We use cookies to analyze site traffic and improve your experience. Your data is
                  never sold or shared.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleAccept}
                    size="sm"
                    className="bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white font-medium text-xs px-4 py-2 h-auto shadow-md hover:shadow-[0_0_20px_rgba(155,141,227,0.4)] transition-all duration-300"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={handleDecline}
                    size="sm"
                    variant="outline"
                    className="bg-transparent border border-[#9B8DE3]/40 hover:border-[#F8A1D1]/60 hover:bg-[#9B8DE3]/10 text-[#F4E8DC]/80 hover:text-white font-medium text-xs px-4 py-2 h-auto transition-all duration-300"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Decline
                  </Button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDecline}
                className="flex-shrink-0 rounded-full p-1 text-[#F4E8DC]/50 hover:text-[#F8A1D1] hover:bg-white/5 transition-all duration-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
