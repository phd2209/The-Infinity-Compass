import type { NFT } from '@/types/nft';

// Note: Contract addresses and Alchemy logic moved to backend API
// WoW and WoWG contract addresses are now handled server-side

/**
 * Fetch user's WoW and WoWG NFTs using backend API
 */
export async function fetchUserWoWNFTs(walletAddress: string): Promise<NFT[]> {
  try {
    // Call backend API instead of Alchemy directly
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/fetch-nfts?wallet=${walletAddress}`);

    if (!response.ok) {
      throw new Error('Failed to fetch NFTs from backend');
    }

    const data = await response.json();

    // Backend returns: { nfts: NFT[], cached: boolean, count: number }
    return data.nfts || [];
  } catch (error) {
    console.error('Error fetching WoW NFTs:', error);
    return [];
  }
}

// Note: transformAlchemyNFT and Alchemy-specific logic moved to backend API
// Backend handles all NFT fetching and transformation
