import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stars, Sparkles, User, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

interface PathSelectionPageProps {
  onPathSelected: () => void;
}

export default function PathSelectionPage({ onPathSelected }: PathSelectionPageProps) {
  const { setUserPath } = useAuth();
  const [selectedPath, setSelectedPath] = useState<'wow' | 'non-wow' | null>(null);

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

  const handlePathSelection = (path: 'wow' | 'non-wow') => {
    setSelectedPath(path);
    setUserPath(path);

    // Small delay for animation, then navigate
    setTimeout(() => {
      onPathSelected();
    }, 300);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-5 py-8 relative overflow-hidden">
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

      {/* Mystical Glow Effect */}
      <div
        className="absolute inset-0 pointer-events-none cosmic-pulse opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(155, 141, 227, 0.15) 0%, rgba(248, 161, 209, 0.1) 50%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-4xl mx-auto relative z-20">
        <Card className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/30 to-[#0C0A1E]/30 border-[#9B8DE3]/40 shadow-2xl hover:shadow-[#9B8DE3]/30 transition-all duration-500">
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/logo_transp.png" alt="The Infinity Compass" className="h-24 w-auto" />
            </div>

            <h1
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#9B8DE3] via-[#F8A1D1] to-[#6BCFF6] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Choose Your Path
            </h1>

            <p
              className="text-[#F4E8DC]/90 text-lg leading-relaxed px-4 max-w-2xl mx-auto"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Begin your journey into the ancient wisdom of numerology. Select how you'd like to experience your cosmic reading.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Path Options */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* WoW NFT Holder Path */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handlePathSelection('wow')}
                  className={`
                    w-full h-full p-8 rounded-2xl border-2 transition-all duration-300
                    ${selectedPath === 'wow'
                      ? 'bg-gradient-to-br from-[#9B8DE3]/30 to-[#F8A1D1]/30 border-[#9B8DE3] shadow-lg shadow-[#9B8DE3]/50'
                      : 'bg-black/20 border-[#9B8DE3]/40 hover:border-[#9B8DE3]/80 hover:bg-black/30'
                    }
                  `}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9B8DE3] to-[#F8A1D1] flex items-center justify-center shadow-lg shadow-[#9B8DE3]/50">
                      <Wallet className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl font-bold text-[#F4E8DC]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      I Own a WoW NFT
                    </h3>

                    {/* Description */}
                    <p
                      className="text-[#F4E8DC]/80 text-base leading-relaxed"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Connect your wallet and unite your World of Women NFT with the cosmic wisdom of numerology for a personalized reading.
                    </p>

                    {/* Features */}
                    <div className="space-y-2 text-sm text-[#F4E8DC]/70" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <div className="flex items-center gap-2 justify-center">
                        <Stars className="w-4 h-4 text-[#9B8DE3]" />
                        <span>NFT-Integrated Reading</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <Sparkles className="w-4 h-4 text-[#F8A1D1]" />
                        <span>Shareable Cosmic Card</span>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>

              {/* Non-WoW Path */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handlePathSelection('non-wow')}
                  className={`
                    w-full h-full p-8 rounded-2xl border-2 transition-all duration-300
                    ${selectedPath === 'non-wow'
                      ? 'bg-gradient-to-br from-[#F8A1D1]/30 to-[#6BCFF6]/30 border-[#F8A1D1] shadow-lg shadow-[#F8A1D1]/50'
                      : 'bg-black/20 border-[#F8A1D1]/40 hover:border-[#F8A1D1]/80 hover:bg-black/30'
                    }
                  `}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F8A1D1] to-[#6BCFF6] flex items-center justify-center shadow-lg shadow-[#F8A1D1]/50">
                      <User className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl font-bold text-[#F4E8DC]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Generate My Cosmic Avatar
                    </h3>

                    {/* Description */}
                    <p
                      className="text-[#F4E8DC]/80 text-base leading-relaxed"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Let AI create a unique cosmic avatar based on your numerology reading. No NFT required—just your name and birth date.
                    </p>

                    {/* Features */}
                    <div className="space-y-2 text-sm text-[#F4E8DC]/70" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <div className="flex items-center gap-2 justify-center">
                        <Stars className="w-4 h-4 text-[#F8A1D1]" />
                        <span>AI-Generated Avatar</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <Sparkles className="w-4 h-4 text-[#6BCFF6]" />
                        <span>Personalized Reading</span>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            </div>

            {/* Info Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center pt-6"
            >
              <p
                className="text-[#F4E8DC]/60 text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Both paths provide deep insights into your cosmic blueprint through numerology
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
