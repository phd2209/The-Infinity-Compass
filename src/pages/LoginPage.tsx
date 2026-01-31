import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDiscordAuthUrl } from '@/config/discord';
import { DemoModal } from '@/components/DemoModal';
import { CookieConsent } from '@/components/CookieConsent';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isDiscordRequired, bypassVerification } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [greeting, setGreeting] = useState('');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Select random greeting on mount
    const randomGreeting = t.greetings[Math.floor(Math.random() * t.greetings.length)];
    setGreeting(randomGreeting);
  }, [t.greetings]);

  const handleDiscordLogin = () => {
    // Redirect to Discord OAuth2 authorization
    window.location.href = getDiscordAuthUrl();
  };

  const handleEnter = () => {
    // Bypass verification and go directly to the reading form
    bypassVerification();
    navigate('/enter');
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Cosmic particles background */}
      <div className="cosmic-particles">
        {Array.from({ length: 50 }).map((_, i) => (
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

      {/* Sacred geometry background */}
      <div className="sacred-geometry">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Geometric mandala pattern */}
          <circle
            cx="400"
            cy="400"
            r="300"
            fill="none"
            stroke="rgba(155, 141, 227, 0.3)"
            strokeWidth="1"
          />
          <circle
            cx="400"
            cy="400"
            r="200"
            fill="none"
            stroke="rgba(155, 141, 227, 0.3)"
            strokeWidth="1"
          />
          <circle
            cx="400"
            cy="400"
            r="100"
            fill="none"
            stroke="rgba(155, 141, 227, 0.3)"
            strokeWidth="1"
          />
          {/* Add radiating lines for sacred geometry */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 400 + Math.cos(angle) * 100;
            const y1 = 400 + Math.sin(angle) * 100;
            const x2 = 400 + Math.cos(angle) * 300;
            const y2 = 400 + Math.sin(angle) * 300;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(155, 141, 227, 0.2)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>

      {/* Language Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-20" ref={langDropdownRef}>
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1033]/60 backdrop-blur-sm border border-[#9B8DE3]/30 hover:border-[#9B8DE3]/50 transition-all duration-300"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <Globe className="w-4 h-4 text-[#9B8DE3]" />
          <span className="text-sm text-[#F4E8DC]">{language === 'en' ? 'EN' : 'DA'}</span>
          <ChevronDown className={`w-4 h-4 text-[#F4E8DC]/60 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isLangOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-36 rounded-lg bg-[#1a1033]/95 backdrop-blur-md border border-[#9B8DE3]/30 shadow-xl overflow-hidden"
            >
              <button
                onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition-colors ${
                  language === 'en'
                    ? 'bg-[#9B8DE3]/20 text-[#F4E8DC]'
                    : 'text-[#F4E8DC]/70 hover:bg-[#9B8DE3]/10 hover:text-[#F4E8DC]'
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="text-base">🇬🇧</span>
                <span>English</span>
                {language === 'en' && <span className="ml-auto text-[#9B8DE3]">✓</span>}
              </button>
              <button
                onClick={() => { setLanguage('da'); setIsLangOpen(false); }}
                className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition-colors ${
                  language === 'da'
                    ? 'bg-[#F8A1D1]/20 text-[#F4E8DC]'
                    : 'text-[#F4E8DC]/70 hover:bg-[#F8A1D1]/10 hover:text-[#F4E8DC]'
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="text-base">🇩🇰</span>
                <span>Dansk</span>
                {language === 'da' && <span className="ml-auto text-[#F8A1D1]">✓</span>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-3 max-w-3xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo_transp.png" alt="The Infinity Compass" className="h-44 w-auto" />
            {/* <NumerologyLogo size={180} /> */}
          </div>

          {/* Geometric halo behind title */}
          <div className="relative inline-block">
            <div className="absolute inset-0 -z-10 scale-150 opacity-30">
              <svg
                className="w-full h-full"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#9B8DE3"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="none"
                  stroke="#F8A1D1"
                  strokeWidth="1"
                  opacity="0.4"
                />
              </svg>
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#9B8DE3] via-[#F8A1D1] to-[#6BCFF6] bg-clip-text text-transparent"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {t.appTitle}
            </h1>
          </div>

          <p
            className="text-xl md:text-2xl text-[#F4E8DC] italic leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            "{t.appTagline}"
          </p>
        </div>

        {/* Fortune Teller Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8 flex flex-col items-center"
        >
          {/* Glow/halo behind fortune teller */}
          <div className="relative">
            <div
              className="absolute inset-0 -z-10 scale-[2] blur-2xl opacity-60"
              style={{
                background: 'radial-gradient(circle, rgba(248,161,209,0.4) 0%, rgba(155,141,227,0.3) 40%, transparent 70%)'
              }}
            />
            <motion.img
              src="/fortune-teller-1.png"
              alt="Fortune Teller"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-28 h-28 object-contain drop-shadow-[0_0_25px_rgba(248,161,209,0.5)] mb-3"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[#F4E8DC] italic text-lg md:text-xl drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {greeting}
          </motion.p>
        </motion.div>

        {/* Content Section - Direct on background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full max-w-md text-center space-y-6"
        >
          {isDiscordRequired ? (
            <>
              {/* Discord logo */}
              <div className="flex justify-center mb-4">
                <svg
                  className="w-16 h-16"
                  viewBox="0 0 71 55"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                    fill="#9B8DE3"
                  />
                </svg>
              </div>

              <h2
                className="text-2xl font-semibold text-[#F4E8DC]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {t.discordLoginTitle}
              </h2>

              <Button
                onClick={handleDiscordLogin}
                data-discord-login
                className="w-full cursor-pointer bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white font-semibold py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(155,141,227,0.5)]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <svg
                  className="w-6 h-6 mr-3"
                  viewBox="0 0 71 55"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                    fill="white"
                  />
                </svg>
                {t.btnLoginDiscord}
              </Button>

              {/* See Demo Button */}
              <Button
                onClick={() => setIsDemoOpen(true)}
                variant="outline"
                className="w-full cursor-pointer bg-transparent border-2 border-[#9B8DE3]/50 hover:border-[#F8A1D1]/70 hover:bg-[#9B8DE3]/10 text-[#F4E8DC] hover:text-white font-medium py-5 text-base transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(155,141,227,0.3)]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Eye className="w-5 h-5 mr-2" />
                {t.btnSeeDemo}
              </Button>

              <div className="space-y-2 pt-2">
                <p
                  className="text-xs text-[#F4E8DC]/70"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {t.discordReadOnly}
                </p>
                <p
                  className="text-xs text-[#F4E8DC]/70"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {t.privacyNote}
                </p>
                <p
                  className="text-xs text-[#F4E8DC]/60 mt-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {t.discordBrowserNote}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Feature highlights */}
              <div className="text-left space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-[#F8A1D1] text-lg">✦</span>
                  <p className="text-base text-[#F4E8DC]/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#F4E8DC] font-medium">{t.featurePersonalTitle}</span> — {t.featurePersonalDesc}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#9B8DE3] text-lg">✦</span>
                  <p className="text-base text-[#F4E8DC]/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#F4E8DC] font-medium">{t.featureYearTitle}</span> — {t.featureYearDesc}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#6BCFF6] text-lg">✦</span>
                  <p className="text-base text-[#F4E8DC]/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#F4E8DC] font-medium">{t.featureShareableTitle}</span> — {t.featureShareableDesc}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleEnter}
                className="w-full max-w-[320px] mx-auto cursor-pointer bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white font-semibold py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(155,141,227,0.5)]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <ArrowRight className="w-6 h-6 mr-2" />
                {t.btnBeginReading}
              </Button>

              {/* Privacy note below button */}
              <p
                className="text-xs text-[#F4E8DC]/70 pt-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t.privacyNote}
              </p>
            </>
          )}
        </motion.div>
      </div>

      {/* Demo Modal */}
      <DemoModal open={isDemoOpen} onOpenChange={setIsDemoOpen} />

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}
