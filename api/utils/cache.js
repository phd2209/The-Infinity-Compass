/**
 * Simple in-memory cache with TTL support
 * For production, replace with Redis (Upstash)
 */

class Cache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Set a value in cache with TTL in seconds
   */
  set(key, value, ttl = 3600) {
    const expiry = Date.now() + (ttl * 1000);
    this.store.set(key, { value, expiry });
  }

  /**
   * Get a value from cache
   * Returns null if expired or not found
   */
  get(key) {
    const item = this.store.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete a key from cache
   */
  delete(key) {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get cache statistics
   */
  stats() {
    let total = 0;
    let expired = 0;
    const now = Date.now();

    for (const [, item] of this.store.entries()) {
      total++;
      if (now > item.expiry) {
        expired++;
      }
    }

    return {
      total,
      expired,
      active: total - expired,
    };
  }
}

// Singleton instance
const cache = new Cache();

// Import crypto for hashing
import crypto from 'crypto';

// Cache key builders
export const CacheKeys = {
  reading: (name, birthdate, nftId, showName = false) => {
    const hash = crypto
      .createHash('sha256')
      .update(`${name}|${birthdate}|${nftId}|${showName ? '1' : '0'}`)
      .digest('hex');
    return `reading:${hash}`;
  },

  nftOwner: (walletAddress) => `nfts:owner:${walletAddress.toLowerCase()}`,

  nftMetadata: (contractAddress, tokenId) =>
    `nft:meta:${contractAddress.toLowerCase()}:${tokenId}`,

  discordVerified: (discordId) => `discord:verified:${discordId}`,

  rateLimit: (identifier, hour) => {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `rate:${identifier}:${date}:${hour}`;
  },
};

// TTL constants (in seconds)
export const TTL = {
  READING: 30 * 24 * 60 * 60, // 30 days
  NFT_OWNER: 15 * 60, // 15 minutes
  NFT_METADATA: 24 * 60 * 60, // 24 hours
  DISCORD_VERIFIED: 10 * 60, // 10 minutes
  RATE_LIMIT: 2 * 60 * 60, // 2 hours
};

export default cache;
