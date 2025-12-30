import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'da' : 'en');
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(155,141,227,0.4)]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Globe className="w-4 h-4 text-[#F4E8DC]" />
      <span className="text-sm font-medium text-[#F4E8DC]">
        {language === 'en' ? 'DA' : 'EN'}
      </span>
    </motion.button>
  );
}
