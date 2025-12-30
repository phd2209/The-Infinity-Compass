/**
 * TalismanPage
 *
 * Premium product page for crystal talisman pendants.
 * Currently a "Coming Soon" placeholder with full product details.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Gem, Package, Award, Shield, Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTalismanConfig, formatPrice, type TalismanConfig } from '@/services/talismanService';
import { useLanguage } from '@/context/LanguageContext';

interface TalismanPageProps {
  userData: {
    name: string;
    birthDate: Date;
    focusArea: string;
  };
}

export default function TalismanPage({ userData }: TalismanPageProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [talisman, setTalisman] = useState<TalismanConfig | null>(null);
  const [email, setEmail] = useState('');
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    // Calculate birth number from birth date (day reduced to single digit)
    const birthDay = userData.birthDate.getDate();
    const config = getTalismanConfig(birthDay);
    setTalisman(config);
  }, [userData.birthDate]);

  const handleNotifyMe = () => {
    if (email) {
      // In a real implementation, this would send to a backend
      console.log('Notify email:', email);
      setIsNotified(true);
    }
  };

  // Translations
  const t = {
    en: {
      backBtn: 'Back to Profile',
      comingSoon: 'Coming Soon',
      yourCrystal: 'Your Sacred Crystal',
      assignedTo: 'Personally assigned to',
      symbolizes: 'Symbolizes',
      aboutCrystal: 'About Your Crystal',
      whatsIncluded: 'What\'s Included',
      materials: 'Premium Materials',
      materialDesc: 'Natural hand-selected crystal with',
      chainIncluded: '18" matching chain included',
      packaging: 'Luxury Packaging',
      packagingDesc: 'Velvet-lined box with signature sleeve',
      certificate: 'Certificate of Authenticity',
      certificateDesc: 'Personalized with your name and birth number',
      ritual: 'Activation Ritual Card',
      ritualDesc: 'Sacred instructions to awaken your talisman',
      notifyTitle: 'Be the First to Know',
      notifyDesc: 'Enter your email to be notified when your talisman becomes available.',
      emailPlaceholder: 'your@email.com',
      notifyBtn: 'Notify Me',
      notified: 'You\'re on the list!',
      notifiedDesc: 'We\'ll email you when your talisman is available.',
      uniqueNote: 'Each crystal is unique — the one that arrives is the one meant for you.',
    },
    da: {
      backBtn: 'Tilbage til Profil',
      comingSoon: 'Kommer Snart',
      yourCrystal: 'Din Hellige Krystal',
      assignedTo: 'Personligt tildelt til',
      symbolizes: 'Symboliserer',
      aboutCrystal: 'Om Din Krystal',
      whatsIncluded: 'Hvad Er Inkluderet',
      materials: 'Premium Materialer',
      materialDesc: 'Naturlig håndudvalgt krystal med',
      chainIncluded: '45 cm matchende kæde inkluderet',
      packaging: 'Luksus Emballage',
      packagingDesc: 'Fløjlsforet æske med signatur sleeve',
      certificate: 'Ægthedsbevis',
      certificateDesc: 'Personliggjort med dit navn og fødselstal',
      ritual: 'Aktiveringsritual Kort',
      ritualDesc: 'Hellige instruktioner til at vække din talisman',
      notifyTitle: 'Vær den Første til at Vide',
      notifyDesc: 'Indtast din email for at blive notificeret når din talisman bliver tilgængelig.',
      emailPlaceholder: 'din@email.dk',
      notifyBtn: 'Giv Mig Besked',
      notified: 'Du er på listen!',
      notifiedDesc: 'Vi sender dig en email når din talisman er tilgængelig.',
      uniqueNote: 'Hver krystal er unik — den der ankommer er den der er bestemt for dig.',
    }
  };

  const text = language === 'da' ? t.da : t.en;

  if (!talisman) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#9B8DE3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-6 px-4 relative overflow-hidden">
      {/* Cosmic particles */}
      <div className="cosmic-particles">
        {Array.from({ length: 15 }).map((_, i) => (
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
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/share')}
          className="flex items-center gap-2 text-[#F4E8DC]/60 hover:text-[#F4E8DC] transition-colors mb-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          {text.backBtn}
        </motion.button>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9B8DE3]/20 to-[#F8A1D1]/20 border border-[#9B8DE3]/40 text-[#F8A1D1] text-sm font-medium"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#F8A1D1] animate-pulse" />
            {text.comingSoon}
          </span>
        </motion.div>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/90 to-[#0C0A1E]/90 border-[#9B8DE3]/40 rounded-3xl overflow-hidden shadow-2xl mb-6"
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-br from-[#1D1B3A] to-[#0C0A1E] p-8">
            <img
              src={talisman.imageUrl}
              alt={talisman.crystal}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
            {/* Price Badge */}
            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-[#0C0A1E]/80 border border-[#9B8DE3]/40">
              <span className="text-[#F4E8DC] font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                {formatPrice(talisman.price)}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-[#F4E8DC]/50 text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {text.yourCrystal}
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#9B8DE3] via-[#F8A1D1] to-[#6BCFF6] bg-clip-text text-transparent mb-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {talisman.crystal}
              </h1>
              <p className="text-[#F4E8DC]/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {text.assignedTo} <span className="text-[#F8A1D1]">{userData.name}</span>
              </p>
            </div>

            {/* Meaning */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9B8DE3]/10 border border-[#9B8DE3]/30">
                <Gem className="w-4 h-4 text-[#9B8DE3]" />
                <span className="text-[#F4E8DC]/80 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {text.symbolizes} <span className="text-[#F8A1D1] font-medium">{talisman.meaning}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-[#F4E8DC]/60 text-sm uppercase tracking-wider mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {text.aboutCrystal}
              </h2>
              <p className="text-[#F4E8DC]/80 text-base leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {talisman.description}
              </p>
            </div>

            {/* Unique Note */}
            <p className="text-[#F4E8DC]/70 text-base italic text-center mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              "{text.uniqueNote}"
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#9B8DE3]/30 to-transparent" />
              <span className="text-[#F8A1D1]">✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#9B8DE3]/30 to-transparent" />
            </div>

            {/* What's Included */}
            <h2 className="text-[#F4E8DC]/60 text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {text.whatsIncluded}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Materials */}
              <div className="flex gap-3 p-3 rounded-xl bg-[#0C0A1E]/50 border border-[#9B8DE3]/20">
                <div className="w-10 h-10 rounded-full bg-[#9B8DE3]/10 flex items-center justify-center flex-shrink-0">
                  <Gem className="w-5 h-5 text-[#9B8DE3]" />
                </div>
                <div>
                  <h3 className="text-[#F4E8DC] text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {text.materials}
                  </h3>
                  <p className="text-[#F4E8DC]/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {text.materialDesc} {talisman.metalDisplay}. {text.chainIncluded}
                  </p>
                </div>
              </div>

              {/* Packaging */}
              <div className="flex gap-3 p-3 rounded-xl bg-[#0C0A1E]/50 border border-[#9B8DE3]/20">
                <div className="w-10 h-10 rounded-full bg-[#F8A1D1]/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-[#F8A1D1]" />
                </div>
                <div>
                  <h3 className="text-[#F4E8DC] text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {text.packaging}
                  </h3>
                  <p className="text-[#F4E8DC]/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {text.packagingDesc}
                  </p>
                </div>
              </div>

              {/* Certificate */}
              <div className="flex gap-3 p-3 rounded-xl bg-[#0C0A1E]/50 border border-[#9B8DE3]/20">
                <div className="w-10 h-10 rounded-full bg-[#6BCFF6]/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#6BCFF6]" />
                </div>
                <div>
                  <h3 className="text-[#F4E8DC] text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {text.certificate}
                  </h3>
                  <p className="text-[#F4E8DC]/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {text.certificateDesc}
                  </p>
                </div>
              </div>

              {/* Ritual Card */}
              <div className="flex gap-3 p-3 rounded-xl bg-[#0C0A1E]/50 border border-[#9B8DE3]/20">
                <div className="w-10 h-10 rounded-full bg-[#9B8DE3]/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#9B8DE3]" />
                </div>
                <div>
                  <h3 className="text-[#F4E8DC] text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {text.ritual}
                  </h3>
                  <p className="text-[#F4E8DC]/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {text.ritualDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notify Me Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/90 to-[#0C0A1E]/90 border border-[#9B8DE3]/40 rounded-2xl p-6 text-center"
        >
          {!isNotified ? (
            <>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9B8DE3]/20 to-[#F8A1D1]/20 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-[#F8A1D1]" />
              </div>
              <h2 className="text-xl font-semibold text-[#F4E8DC] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                {text.notifyTitle}
              </h2>
              <p className="text-[#F4E8DC]/60 text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {text.notifyDesc}
              </p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={text.emailPlaceholder}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#0C0A1E]/80 border border-[#9B8DE3]/30 text-[#F4E8DC] placeholder-[#F4E8DC]/30 focus:outline-none focus:border-[#9B8DE3]/60 transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
                <Button
                  onClick={handleNotifyMe}
                  disabled={!email}
                  className="px-6 bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white disabled:opacity-50"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {text.notifyBtn}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9B8DE3]/20 to-[#F8A1D1]/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-[#6BCFF6]" />
              </div>
              <h2 className="text-xl font-semibold text-[#F4E8DC] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                {text.notified}
              </h2>
              <p className="text-[#F4E8DC]/60 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {text.notifiedDesc}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
