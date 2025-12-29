/**
 * YearForecastPage
 *
 * Simple input flow for the year series forecast.
 * Users enter name and birthdate to see their yearly periods.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, ArrowRight, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateNumerologyData } from '@/utils/numerology';
import {
  calculateColumnNumber,
  extractNumericValue,
  reduceNumber,
} from '@/services/yearSeriesService';
import YearForecastCard from '@/components/YearForecastCard';

const STORAGE_KEY = 'infinity_compass_forecast_data';

interface StoredData {
  name: string;
  birthDateStr: string;
  topDiamond: number;
  bottomDiamond: number;
  columnNumber: number;
  savedAt: string;
}

export default function YearForecastPage() {
  const [name, setName] = useState('');
  const [birthDateStr, setBirthDateStr] = useState('');
  const [showForecast, setShowForecast] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasStoredData, setHasStoredData] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [forecastData, setForecastData] = useState<{
    name: string;
    birthDate: Date;
    topDiamond: number;
    bottomDiamond: number;
    columnNumber: number;
  } | null>(null);

  // Load stored data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredData = JSON.parse(stored);
        setName(data.name);
        setBirthDateStr(data.birthDateStr);
        setHasStoredData(true);
        setRememberMe(true);

        // Auto-show forecast if we have valid stored data
        const birthDate = new Date(data.birthDateStr);
        if (data.name && !isNaN(birthDate.getTime())) {
          setForecastData({
            name: data.name,
            birthDate,
            topDiamond: data.topDiamond,
            bottomDiamond: data.bottomDiamond,
            columnNumber: data.columnNumber,
          });
          setShowForecast(true);
        }
      }
    } catch (e) {
      console.error('Failed to load stored data:', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveToStorage = (data: StoredData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setHasStoredData(true);
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  };

  const clearStoredData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasStoredData(false);
    setRememberMe(false);
    setShowClearConfirm(false);
    setName('');
    setBirthDateStr('');
    setShowForecast(false);
    setForecastData(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !birthDateStr) return;

    const birthDate = new Date(birthDateStr);
    const numerologyData = calculateNumerologyData(name, birthDate);

    // Calculate column number from diamond data
    const columnData = calculateColumnNumber({
      top: numerologyData.diamond_upper_value,
      bottom: extractNumericValue(numerologyData.diamond_lower_value),
      upperCircle: numerologyData.diamond_upper_circle.map(extractNumericValue),
      upperLowerCircle: numerologyData.diamond_upper_lower_circle.map(extractNumericValue),
      lowerCircle: numerologyData.diamond_lower_circle.map(extractNumericValue),
      lowerLowerCircle: numerologyData.diamond_lower_lower_circle.map(extractNumericValue),
      midNameValues: numerologyData.midNameValues.map(extractNumericValue),
    });

    const topDiamond = numerologyData.diamond_upper_value;
    const bottomDiamond = reduceNumber(extractNumericValue(numerologyData.diamond_lower_value));
    const columnNumber = columnData.reduced;

    setForecastData({
      name: name.trim(),
      birthDate,
      topDiamond,
      bottomDiamond,
      columnNumber,
    });

    // Save to localStorage if user opted in
    if (rememberMe) {
      saveToStorage({
        name: name.trim(),
        birthDateStr,
        topDiamond,
        bottomDiamond,
        columnNumber,
        savedAt: new Date().toISOString(),
      });
    }

    setShowForecast(true);
  };

  const handleBack = () => {
    setShowForecast(false);
  };

  return (
    <div className="min-h-screen gradient-bg py-8 px-4 relative overflow-hidden">
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

      <div className="max-w-lg mx-auto relative z-10">
        {!showForecast ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9B8DE3]/20 border border-[#9B8DE3]/40 mb-4"
              >
                <Calendar className="w-4 h-4 text-[#9B8DE3]" />
                <span
                  className="text-sm text-[#F4E8DC]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Year Series Forecast
                </span>
              </motion.div>

              <h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] bg-clip-text text-transparent mb-3"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Discover Your Year Ahead
              </h1>

              <p
                className="text-[#F4E8DC]/70 max-w-md mx-auto"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Enter your details to reveal the cosmic periods shaping your year
              </p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6 p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(145deg, rgba(29, 27, 58, 0.8) 0%, rgba(12, 10, 30, 0.8) 100%)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(155, 141, 227, 0.2)',
              }}
            >
              {/* Name input */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[#F4E8DC] text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-[#1D1B3A]/50 border-[#9B8DE3]/30 text-[#F4E8DC] placeholder:text-[#F4E8DC]/40 focus:border-[#F8A1D1] focus:ring-[#F8A1D1]/20"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  required
                />
              </div>

              {/* Birth date input */}
              <div className="space-y-2">
                <Label
                  htmlFor="birthdate"
                  className="text-[#F4E8DC] text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Birth Date
                </Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthDateStr}
                  onChange={(e) => setBirthDateStr(e.target.value)}
                  className="bg-[#1D1B3A]/50 border-[#9B8DE3]/30 text-[#F4E8DC] focus:border-[#F8A1D1] focus:ring-[#F8A1D1]/20 [color-scheme:dark]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  required
                />
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#9B8DE3]/50 bg-[#1D1B3A]/50 text-[#9B8DE3] focus:ring-[#9B8DE3]/30 focus:ring-offset-0"
                  />
                  <span
                    className="text-[#F4E8DC]/70 text-sm group-hover:text-[#F4E8DC] transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Remember me for next visit
                  </span>
                </label>

                {hasStoredData && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-[#F4E8DC]/50 text-xs hover:text-[#F8A1D1] transition-colors flex items-center gap-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear saved data
                  </button>
                )}
              </div>

              {/* Privacy note */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#9B8DE3]/10 border border-[#9B8DE3]/20">
                <Shield className="w-4 h-4 text-[#9B8DE3] flex-shrink-0 mt-0.5" />
                <p
                  className="text-[#F4E8DC]/60 text-xs leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Your data stays on your device only. We never send or store your personal information on our servers.
                </p>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white py-6 text-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Reveal My Forecast
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.form>

            {/* Info text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-[#F4E8DC]/50 text-xs mt-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Your year is divided into cosmic periods, each with unique energy
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Back button */}
            <Button
              onClick={handleBack}
              variant="outline"
              className="mb-6 bg-black/40 border-[#9B8DE3]/40 text-[#F4E8DC] hover:bg-[#9B8DE3]/20"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ← New Reading
            </Button>

            {/* Forecast card */}
            {forecastData && (
              <YearForecastCard
                name={forecastData.name}
                birthDate={forecastData.birthDate}
                topDiamond={forecastData.topDiamond}
                bottomDiamond={forecastData.bottomDiamond}
                columnNumber={forecastData.columnNumber}
              />
            )}
          </motion.div>
        )}
      </div>

      {/* Clear data confirmation modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#1D1B3A] to-[#0C0A1E] p-6 rounded-2xl border border-[#9B8DE3]/40 max-w-sm w-full"
            >
              <h3
                className="text-xl font-bold text-[#F4E8DC] mb-3"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Clear Saved Data?
              </h3>
              <p
                className="text-[#F4E8DC]/70 text-sm mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                This will remove your name and birth date from this device. You'll need to enter them again on your next visit.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowClearConfirm(false)}
                  variant="outline"
                  className="flex-1 bg-transparent border-[#9B8DE3]/40 text-[#F4E8DC] hover:bg-[#9B8DE3]/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={clearStoredData}
                  className="flex-1 bg-gradient-to-r from-[#F8A1D1] to-[#E891C1] hover:from-[#E891C1] hover:to-[#D881B1] text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
