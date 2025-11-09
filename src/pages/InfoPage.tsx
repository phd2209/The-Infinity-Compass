import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function InfoPage() {
  const navigate = useNavigate();
  const { isDiscordRequired } = useAuth();

  // Generate floating particles
  const generateParticles = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * -8}s`,
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Cosmic Particles */}
      <div className="cosmic-particles">{generateParticles()}</div>

      {/* Sacred Geometry Background */}
      <div className="sacred-geometry">
        <svg width="100%" height="100%" viewBox="0 0 800 600" className="absolute opacity-5">
          <defs>
            <pattern id="wowPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(155, 141, 227, 0.3)" strokeWidth="1" />
              <polygon points="50,20 65,35 65,65 50,80 35,65 35,35" fill="none" stroke="rgba(248, 161, 209, 0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wowPattern)" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 py-8 max-w-6xl mx-auto">
        {/* Header with logo and back button */}
        <header className="flex items-center justify-between mb-8">
          <img src="/logo_transp.png" alt="The Infinity Compass" className="h-24 w-auto" />
          <Button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white font-semibold cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal
          </Button>
        </header>

        {/* Hero section */}
        <section className="flex flex-col md:flex-row gap-8 items-start mb-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:items-start"
          >
            <div className="relative">
              <img
                src="/fortune-teller-1.png"
                alt="The Fortune Teller"
                className="w-48 h-48 object-contain drop-shadow-[0_0_40px_rgba(155,141,227,0.35)]"
              />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: '0 0 60px rgba(155,141,227,0.25)' }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#9B8DE3] via-[#F8A1D1] to-[#6BCFF6] bg-clip-text text-transparent mb-2"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              About The Fortune Teller
            </h1>
            <p
              className="text-[#F4E8DC]/70 text-base mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              The Fortune Teller is WoW #9018
            </p>
            <p
              className="text-[#F4E8DC]/90 text-lg md:text-xl leading-relaxed italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Welcome, traveler — before you step through the portal, let's align your energy with the stars.
            </p>
          </motion.div>
        </section>

        {/* Content sections */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Numerology section */}
          <Card className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/30 to-[#0C0A1E]/30 border-[#9B8DE3]/40">
            <CardHeader>
              <h2
                className="text-2xl font-semibold text-[#F4E8DC] flex items-center gap-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Sparkles className="w-6 h-6 text-[#9B8DE3]" />
                The Wisdom of Cheiro Numerology
              </h2>
            </CardHeader>
            <CardContent>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                The <strong>Fortune Teller</strong> draws upon the ancient wisdom of <em>Cheiro's Numerology</em>,
                rooted in the Chaldean tradition — one of the oldest and most mystical systems of numerical divination.
                This sacred art reveals that <strong>numbers hold a vibrational essence</strong> that influences every aspect
                of our existence, from personality to destiny.
              </p>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed mt-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                In Cheiro's philosophy, each number from 1 to 9 is linked to celestial bodies and cosmic forces —
                the Sun's leadership (1), the Moon's intuition (2), Jupiter's authority (3), and beyond.
                Your name carries a <em>destiny number</em> that shapes your life's expression, while your birth date
                anchors your <em>soul's blueprint</em> in time and space.
              </p>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed mt-4 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                "Numbers are not merely abstract symbols — they are the language through which the universe
                whispers its secrets, revealing the hidden rhythms that guide us through life's journey."
              </p>
            </CardContent>
          </Card>

          {/* Name and Birthday section */}
          <Card className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/30 to-[#0C0A1E]/30 border-[#9B8DE3]/40">
            <CardHeader>
              <h2
                className="text-2xl font-semibold text-[#F4E8DC] flex items-center gap-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Sparkles className="w-6 h-6 text-[#F8A1D1]" />
                Your Name and Birth Date: Keys to Your Destiny
              </h2>
            </CardHeader>
            <CardContent>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                In Cheiro's system, two sacred elements unlock your numerological portrait:
              </p>
              <ul className="space-y-4 ml-4">
                <li
                  className="text-[#F4E8DC]/80 text-base leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <strong className="text-[#9B8DE3]">Your Birth Name</strong> — Each letter carries a numerical vibration.
                  Together, they form your <em>Destiny Number</em> (or Expression Number), revealing your life's purpose,
                  innate talents, and the path you're meant to walk in this world.
                </li>
                <li
                  className="text-[#F4E8DC]/80 text-base leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <strong className="text-[#F8A1D1]">Your Birth Date</strong> — The day you entered this world anchors your soul's frequency.
                  It reveals your <em>Birth Number</em> and planetary influences, shaping your core nature, strengths,
                  and the cosmic rhythms that guide your journey.
                </li>
              </ul>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed mt-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                These details are used <strong>only to calculate your unique numerological signature</strong> — nothing is stored,
                shared with third parties, or linked to your Discord or wallet. They serve purely to reveal how your personal
                essence harmonizes with your chosen NFT's cosmic frequency.
              </p>
            </CardContent>
          </Card>

          {/* Discord Login section - Only show when Discord is required */}
          {isDiscordRequired && (
            <Card className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/30 to-[#0C0A1E]/30 border-[#9B8DE3]/40">
              <CardHeader>
                <h2
                  className="text-2xl font-semibold text-[#F4E8DC] flex items-center gap-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Sparkles className="w-6 h-6 text-[#6BCFF6]" />
                  Why Discord Login?
                </h2>
              </CardHeader>
              <CardContent>
                <p
                  className="text-[#F4E8DC]/80 text-base leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  We use <strong>Discord authentication</strong> to recognize verified <strong>World of Women</strong> and <strong>World of Women Galaxy</strong> holders —
                  a seamless way to confirm community membership <strong>without requiring a wallet connection</strong>.
                </p>
                <p
                  className="text-[#F4E8DC]/80 text-base leading-relaxed mt-4"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Your privacy remains fully protected; the app receives only your Discord ID and username.
                </p>
              </CardContent>
            </Card>
          )}

          {/* NFT Merge section */}
          <Card className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/30 to-[#0C0A1E]/30 border-[#9B8DE3]/40">
            <CardHeader>
              <h2
                className="text-2xl font-semibold text-[#F4E8DC] flex items-center gap-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Sparkles className="w-6 h-6 text-[#9B8DE3]" />
                Merging Your Energy with Your NFT
              </h2>
            </CardHeader>
            <CardContent>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Your <strong>WoW or WoWG NFT</strong> acts as a cosmic mirror — a reflection of grace, color, and energy.
                By merging your numerological profile with your NFT, the Fortune Teller reveals how your personal essence and your artwork's aura harmonize.
              </p>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed mt-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Together, they form a portrait of your creative and spiritual alignment — a fusion of art, soul, and symbolism.
              </p>
            </CardContent>
          </Card>

          {/* Questions section */}
          <Card className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/30 to-[#0C0A1E]/30 border-[#9B8DE3]/40">
            <CardHeader>
              <h2
                className="text-2xl font-semibold text-[#F4E8DC] flex items-center gap-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Sparkles className="w-6 h-6 text-[#F8A1D1]" />
                Questions or Thoughts?
              </h2>
            </CardHeader>
            <CardContent>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                If you have any questions or insights to share, the Fortune Teller welcomes your message.
                Send a DM to <strong>@dkToniEth</strong> on X.
              </p>
              <p
                className="text-[#F4E8DC]/80 text-base leading-relaxed mt-4 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Your journey is uniquely yours — but the stars love curious minds.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p
            className="text-[#F4E8DC]/60 text-base italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            "Numbers are the language of fate — and art, its most beautiful accent."
          </p>
          <p
            className="text-[#F4E8DC]/50 text-sm mt-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            — The Fortune Teller 🔮
          </p>
        </footer>
      </div>
    </div>
  );
}
