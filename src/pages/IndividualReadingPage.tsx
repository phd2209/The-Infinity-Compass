import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { enUS, da } from 'date-fns/locale';
import { CalendarIcon, Stars, Sparkles, Loader2, X, ArrowLeft } from 'lucide-react';
import "react-day-picker/style.css";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { NFTSelector } from '@/components/NFTSelector';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { fetchUserWoWNFTs } from '@/services/nft';
import { sanitizeNameForCalculation } from '@/utils/numerology';

const formSchema = z.object({
  name: z.string()
    .min(1, 'Your sacred name holds the key to your numerology. Please enter your full birth name.')
    .refine(
      (name) => {
        // Sanitize the name to replace special characters (hyphens, etc.) with spaces
        // This ensures "anne-dorthe" counts as 2 words, not 1
        const sanitizedName = sanitizeNameForCalculation(name);
        const wordCount = sanitizedName.split(/\s+/).filter(word => word.length > 0).length;
        return wordCount >= 2 && wordCount <= 4;
      },
      {
        message: 'The cosmic energies align best with names of 2 to 4 sacred words. Please enter your first, middle (optional), and last name.',
      }
    ),
  birthDate: z.date({
    message: 'Your cosmic birth date is required to unlock your numerology blueprint.',
  }),
  collection: z.enum(['all', 'WoW', 'WoWG']),
  focusArea: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface IndividualReadingPageProps {
  onUnLock: (data: { name: string; birthDate: Date; focusArea: string }) => void;
  onBack?: () => void;
}

// Map language codes to date-fns locales
const localeMap = {
  en: enUS,
  da: da,
};

export default function IndividualReadingPage({ onUnLock, onBack }: IndividualReadingPageProps) {
  const { wowNFTs, selectedNFT, setWowNFTs, setSelectedNFT, userPath } = useAuth();
  const { t, language } = useLanguage();
  const calendarLocale = localeMap[language] || enUS;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showWalletInput, setShowWalletInput] = useState(true);
  const [noNFTsFound, setNoNFTsFound] = useState(false);

  // Check if user is on non-WoW path (skip NFT selection)
  const isNonWowPath = userPath === 'non-wow';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      collection: 'all',
      focusArea: '',
    },
  });

  const collectionFilter = form.watch('collection');

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

  const handleFetchNFTs = async () => {
    if (!walletAddress) {
      return;
    }

    setIsLoadingNFTs(true);
    setNoNFTsFound(false);
    try {
      const nfts = await fetchUserWoWNFTs(walletAddress);
      setWowNFTs(nfts);
      if (nfts.length > 0) {
        setShowWalletInput(false);
        setNoNFTsFound(false);
      } else {
        setNoNFTsFound(true);
      }
    } catch {
      alert('Failed to load NFTs. Please check your wallet address and try again.');
    } finally {
      setIsLoadingNFTs(false);
    }
  };

  const handleTryAnotherWallet = () => {
    setWalletAddress('');
    setNoNFTsFound(false);
    setWowNFTs([]);
    setSelectedNFT(null);
  };

  useEffect(() => {
    // Auto-fetch if wallet address is already set
    if (walletAddress && wowNFTs.length === 0) {
      handleFetchNFTs();
    }
  }, []);

  const onSubmit = (data: FormData) => {
    // Only require NFT selection for WoW path
    if (!isNonWowPath && !selectedNFT) {
      form.setError('root', {
        message: 'Please select a WoW NFT to personalize your reading',
      });
      return;
    }

    onUnLock({
      name: data.name,
      birthDate: data.birthDate,
      focusArea: data.focusArea || 'general',
    });
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

      <div className="w-full max-w-2xl mx-auto relative z-20">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-[#F4E8DC]/70 hover:text-[#F8A1D1] transition-colors group"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">{t.btnBack || 'Back'}</span>
          </button>
        )}

        {/* Logo and Title - Floating outside card like landing page */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo_transp.png" alt="The Infinity Compass" className="h-24 w-auto" />
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#9B8DE3] via-[#F8A1D1] to-[#6BCFF6] bg-clip-text text-transparent"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            The Infinity Compass
          </h1>

          {/* Subtitle */}
          <p
            className="text-[#F4E8DC]/90 text-lg mt-4 leading-relaxed px-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t.entrySubtitle}
          </p>
        </div>

        {/* Form Card - Starts from "Enter Your Details" */}
        {/* Gradient border wrapper - 2px visible border as per design recommendation */}
        <div className="p-[2px] rounded-xl bg-gradient-to-br from-[#9B8DE3] via-[#F8A1D1] to-[#9B8DE3] shadow-2xl hover:shadow-[#9B8DE3]/30 transition-all duration-500">
        <Card className="glass-effect mystical-glow backdrop-blur-xl bg-gradient-to-br from-[#1D1B3A]/90 to-[#0C0A1E]/90 border-0 rounded-[10px]">
          <CardContent className="space-y-6 pt-6">
            {/* Wallet Input Section - Only for WoW path */}
            {!isNonWowPath && showWalletInput && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3
                    className="text-xl text-[#F4E8DC] font-semibold"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Enter Your Ethereum Wallet Address
                  </h3>
                  <p
                    className="text-[#F4E8DC]/70 text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    We'll load your WoW NFTs
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-black/40 border-[#9B8DE3]/40 text-white placeholder:text-[#F4E8DC]/50 focus:border-[#9B8DE3] h-12"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                  <Button
                    onClick={handleFetchNFTs}
                    disabled={!walletAddress || isLoadingNFTs}
                    className="bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] h-12 px-6"
                  >
                    {isLoadingNFTs ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Load NFTs'
                    )}
                  </Button>
                </div>

                {/* No NFTs Found Message */}
                {noNFTsFound && (
                  <div className="glass-effect mystical-glow p-6 bg-gradient-to-br from-[#1D1B3A]/90 to-[#0C0A1E]/90 border-[#F8A1D1]/40 space-y-4 rounded-lg">
                    <div className="text-center space-y-3">
                      <div className="text-4xl">🔮</div>
                      <h4
                        className="text-lg font-semibold text-[#F4E8DC]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        No WoW NFTs Found
                      </h4>
                      <p
                        className="text-[#F4E8DC]/80 text-sm"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        We couldn't find any World of Women or World of Women Galaxy NFTs in this wallet address.
                      </p>
                      <p
                        className="text-[#F4E8DC]/60 text-xs"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Please verify the wallet address or try a different wallet that contains your WoW NFTs.
                      </p>
                    </div>
                    <Button
                      onClick={handleTryAnotherWallet}
                      className="w-full bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white font-semibold py-3"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Try Another Wallet
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* NFT Selection Section - Only for WoW path */}
            {!isNonWowPath && !showWalletInput && wowNFTs.length > 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3
                    className="text-xl text-[#F4E8DC] font-semibold mb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Select Your WoW
                  </h3>
                  <p
                    className="text-[#F4E8DC]/70 text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Choose the NFT that resonates with your energy
                  </p>
                </div>

                {/* Collection Filter */}
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="collection"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full bg-black/40 border-[#9B8DE3]/40 text-white h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1D1B3A]/95 border-[#9B8DE3]/40 backdrop-blur-md">
                            <SelectItem value="all" className="text-white hover:bg-[#9B8DE3]/30">
                              All Collections
                            </SelectItem>
                            <SelectItem value="WoW" className="text-white hover:bg-[#9B8DE3]/30">
                              World of Women
                            </SelectItem>
                            <SelectItem value="WoWG" className="text-white hover:bg-[#9B8DE3]/30">
                              World of Women Galaxy
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </Form>

                <NFTSelector
                  nfts={wowNFTs}
                  selectedNFT={selectedNFT}
                  onSelect={setSelectedNFT}
                  collectionFilter={collectionFilter}
                />
              </div>
            )}

            {/* Form Section - Show after NFT selected (WoW path) OR immediately (non-WoW path) */}
            {(isNonWowPath || (!showWalletInput && selectedNFT)) && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {!isNonWowPath && (
                    <div className="h-px bg-gradient-to-r from-transparent via-[#9B8DE3]/50 to-transparent my-6"></div>
                  )}

                  {/* Clear instruction heading */}
                  <div className="text-center space-y-2">
                    <h3
                      className="text-2xl text-[#F4E8DC] font-semibold"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {isNonWowPath ? t.entryHeading : "Almost There!"}
                    </h3>
                    <p
                      className="text-[#F4E8DC]/70 text-base"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {isNonWowPath
                        ? t.entryDescription
                        : "Just 2 more things to unlock your reading"
                      }
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className="text-[#F4E8DC] font-semibold text-lg flex items-center space-x-2 group cursor-pointer"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          <Stars className="w-5 h-5 text-[#F8A1D1] twinkle-on-hover" />
                          <span>{t.labelName}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.placeholderName}
                            className="bg-black/40 border-[#9B8DE3]/40 text-[#F4E8DC] placeholder:text-[#F4E8DC]/40 focus:border-[#F8A1D1] focus:ring-2 focus:ring-[#F8A1D1]/30 focus:bg-black/50 h-16 text-xl font-medium autofill:bg-black/40 autofill:text-[#F4E8DC] transition-all duration-300 focus:shadow-[0_0_20px_rgba(248,161,209,0.3)]"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[#F8A1D1] font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className="text-[#F4E8DC] font-semibold text-lg flex items-center space-x-2 group cursor-pointer"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          <Sparkles className="w-5 h-5 text-[#6BCFF6] twinkle-on-hover" />
                          <span>{t.labelBirthDate}</span>
                        </FormLabel>
                        <div className="relative">
                          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start bg-black/40 border-[#9B8DE3]/40 text-white hover:bg-black/50 hover:border-[#F8A1D1] h-16 text-xl pr-12 transition-all duration-300 focus:border-[#F8A1D1] focus:shadow-[0_0_20px_rgba(248,161,209,0.3)]"
                                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                  <CalendarIcon className="mr-3 h-6 w-6 text-[#9B8DE3]" />
                                  {field.value ? (
                                    <span className="text-white font-medium">{format(field.value, 'dd/MM/yyyy')}</span>
                                  ) : (
                                    <span className="text-[#F4E8DC]/60">{t.placeholderBirthDate}</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date);
                                  // Keep calendar open so user can adjust month/year
                                }
                              }}
                              onMonthChange={(month) => {
                                // Preserve the selected day when month/year changes
                                if (field.value) {
                                  const newDate = new Date(
                                    month.getFullYear(),
                                    month.getMonth(),
                                    field.value.getDate()
                                  );
                                  // Only update if the new date is valid
                                  if (newDate.getMonth() === month.getMonth()) {
                                    field.onChange(newDate);
                                  }
                                }
                              }}
                              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                              initialFocus
                              fromYear={1940}
                              toYear={new Date().getFullYear()}
                              defaultMonth={field.value || new Date(1990, 0)}
                              captionLayout="dropdown"
                              showOutsideDays={false}
                              locale={calendarLocale}
                              formatters={{
                                formatMonthDropdown: (date) =>
                                  format(date, 'MMM', { locale: calendarLocale }),
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {field.value && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(undefined);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4E8DC]/60 hover:text-[#F8A1D1] transition-colors p-1 rounded-full hover:bg-[#F8A1D1]/10"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                        <FormMessage className="text-[#F8A1D1] font-medium" />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.root && (
                    <p className="text-[#F8A1D1] text-base text-center font-medium">
                      {form.formState.errors.root.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white font-bold text-xl py-7 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(155,141,227,0.5)] transition-all duration-300 cursor-pointer"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <Stars className="w-6 h-6 mr-2 animate-pulse" />
                    {t.btnGenerateReading}
                    <Sparkles className="w-6 h-6 ml-2 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </Button>

                  {/* Privacy Message - After submit */}
                  <div className="pt-4">
                    <p
                      className="text-[#F4E8DC]/60 text-xs text-center"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {t.entryPrivacyNote}
                    </p>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
