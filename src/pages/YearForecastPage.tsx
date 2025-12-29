/**
 * YearForecastPage
 *
 * Simple input flow for the year series forecast.
 * Users enter name and birthdate to see their yearly periods.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
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

export default function YearForecastPage() {
  const [name, setName] = useState('');
  const [birthDateStr, setBirthDateStr] = useState('');
  const [showForecast, setShowForecast] = useState(false);
  const [forecastData, setForecastData] = useState<{
    name: string;
    birthDate: Date;
    topDiamond: number;
    bottomDiamond: number;
    columnNumber: number;
  } | null>(null);

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

    setForecastData({
      name: name.trim(),
      birthDate,
      topDiamond: numerologyData.diamond_upper_value,
      bottomDiamond: reduceNumber(extractNumericValue(numerologyData.diamond_lower_value)),
      columnNumber: columnData.reduced,
    });
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
    </div>
  );
}
