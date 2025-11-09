import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { NFT } from '@/types/nft';
import { FEATURES } from '@/config/features';

interface DiscordUser {
  id: string;
  username: string;
}

interface AuthContextType {
  isVerified: boolean;
  discordUser: DiscordUser | null;
  accessToken: string | null;
  wowNFTs: NFT[];
  selectedNFT: NFT | null;
  isDiscordRequired: boolean;
  setAuthenticated: (user: DiscordUser, token: string) => void;
  bypassVerification: () => void;
  setWowNFTs: (nfts: NFT[]) => void;
  setSelectedNFT: (nft: NFT | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [wowNFTs, setWowNFTsState] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFTState] = useState<NFT | null>(null);

  const isDiscordRequired = FEATURES.DISCORD_VERIFICATION_REQUIRED;

  const setAuthenticated = (user: DiscordUser, token: string) => {
    setDiscordUser(user);
    setAccessToken(token);
    setIsVerified(true);
  };

  const bypassVerification = () => {
    if (!isDiscordRequired) {
      setIsVerified(true);
      setDiscordUser({ id: 'guest', username: 'Guest User' });
    }
  };

  const setWowNFTs = (nfts: NFT[]) => {
    setWowNFTsState(nfts);
  };

  const setSelectedNFT = (nft: NFT | null) => {
    setSelectedNFTState(nft);
  };

  const logout = () => {
    setDiscordUser(null);
    setAccessToken(null);
    setIsVerified(false);
    setWowNFTsState([]);
    setSelectedNFTState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isVerified,
        discordUser,
        accessToken,
        wowNFTs,
        selectedNFT,
        isDiscordRequired,
        setAuthenticated,
        bypassVerification,
        setWowNFTs,
        setSelectedNFT,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
