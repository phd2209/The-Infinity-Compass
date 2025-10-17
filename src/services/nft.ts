import type { NFT } from '@/types/nft';

// Note: Contract addresses and Alchemy logic moved to backend API
// WoW and WoWG contract addresses are now handled server-side

/**
 * Retry configuration for NFT fetching
 */
const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  backoffMultiplier: 2, // Double delay each retry
  retryableStatusCodes: [408, 429, 502, 503, 504], // Timeout, rate limit, gateway errors
};

/**
 * Sleep helper for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch user's WoW and WoWG NFTs using backend API with automatic retry on 504 errors
 */
export async function fetchUserWoWNFTs(walletAddress: string): Promise<NFT[]> {
  let lastError: Error | null = null;
  let delay = RETRY_CONFIG.initialDelay;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      // Call backend API instead of Alchemy directly
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/fetch-nfts?wallet=${walletAddress}`);

      if (!response.ok) {
        // Check if error is retryable (504, 503, etc.)
        if (RETRY_CONFIG.retryableStatusCodes.includes(response.status)) {
          const errorMessage = `Backend returned ${response.status} (${response.statusText})`;
          console.warn(`Attempt ${attempt}/${RETRY_CONFIG.maxAttempts}: ${errorMessage}`);

          lastError = new Error(errorMessage);

          // If this isn't the last attempt, wait and retry
          if (attempt < RETRY_CONFIG.maxAttempts) {
            console.log(`Retrying in ${delay}ms...`);
            await sleep(delay);
            delay *= RETRY_CONFIG.backoffMultiplier;
            continue;
          }
        }

        // Non-retryable error or last attempt failed
        throw new Error(`Failed to fetch NFTs from backend (${response.status})`);
      }

      const data = await response.json();

      // Backend returns: { nfts: NFT[], cached: boolean, count: number }
      console.log(`Successfully fetched NFTs on attempt ${attempt}`);
      return data.nfts || [];

    } catch (error) {
      lastError = error as Error;

      // Network errors are also retryable
      if (error instanceof TypeError && attempt < RETRY_CONFIG.maxAttempts) {
        console.warn(`Attempt ${attempt}/${RETRY_CONFIG.maxAttempts}: Network error`, error);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
        delay *= RETRY_CONFIG.backoffMultiplier;
        continue;
      }

      console.error('Error fetching WoW NFTs:', error);
      return [];
    }
  }

  // All retries exhausted
  console.error('All retry attempts exhausted:', lastError);
  return [];
}

// Note: transformAlchemyNFT and Alchemy-specific logic moved to backend API
// Backend handles all NFT fetching and transformation
