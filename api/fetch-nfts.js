import cache, { CacheKeys, TTL } from './utils/cache.js';
import { retryableApiCall } from './utils/retry.js';

// WoW and WoWG contract addresses on Ethereum mainnet
const WOW_CONTRACT = '0xe785E82358879F061BC3dcAC6f0444462D4b5330';
const WOWG_CONTRACT = '0xf61f24c2d93bf2de187546b14425bf631f28d6dc';

/**
 * Fetch user's WoW and WoWG NFTs
 * GET /api/fetch-nfts?wallet=0x...
 * POST /api/fetch-nfts with body: { wallet }
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow both GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get wallet address from query or body
  const walletAddress = req.method === 'GET'
    ? req.query.wallet
    : req.body?.wallet;

  // Validate wallet address
  if (!walletAddress) {
    return res.status(400).json({
      error: 'invalid_request',
      message: 'Missing wallet address',
    });
  }

  if (!isValidEthereumAddress(walletAddress)) {
    return res.status(400).json({
      error: 'invalid_wallet',
      message: 'Invalid Ethereum wallet address',
    });
  }

  // Check for Alchemy API key
  const apiKey = process.env.ALCHEMY_API_KEY;
  if (!apiKey) {
    console.error('Alchemy API key not configured');
    return res.status(503).json({
      error: 'service_unavailable',
      message: 'NFT service is not configured',
    });
  }

  try {
    // Check cache first
    const cacheKey = CacheKeys.nftOwner(walletAddress);
    const cachedNFTs = cache.get(cacheKey);

    if (cachedNFTs) {
      console.log('Cache hit for NFTs:', walletAddress);
      return res.status(200).json({
        nfts: cachedNFTs,
        cached: true,
      });
    }

    console.log('Cache miss. Fetching NFTs from Alchemy...');

    // Fetch NFTs from Alchemy with retry logic
    const nfts = await retryableApiCall(
      () => fetchFromAlchemy(walletAddress, apiKey),
      {
        maxAttempts: 3,
        initialDelay: 1000,
      }
    );

    // Cache the results
    cache.set(cacheKey, nfts, TTL.NFT_OWNER);
    console.log(`NFTs cached for ${TTL.NFT_OWNER} seconds`);

    return res.status(200).json({
      nfts,
      cached: false,
      count: nfts.length,
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);

    // Check if it's a timeout or service unavailable
    if (error.code === 'ETIMEDOUT' || error.response?.status >= 500) {
      return res.status(503).json({
        error: 'service_temporary_unavailable',
        message: 'NFT service is temporarily unavailable. Please try again.',
      });
    }

    return res.status(500).json({
      error: 'fetch_failed',
      message: 'Failed to fetch NFTs. Please try again.',
    });
  }
}

/**
 * Fetch NFTs from Alchemy API
 */
async function fetchFromAlchemy(walletAddress, apiKey) {
  const baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner`;

  // Fetch both WoW and WoWG collections in parallel
  const [wowResponse, wowgResponse] = await Promise.all([
    fetch(`${baseUrl}?owner=${walletAddress}&contractAddresses[]=${WOW_CONTRACT}&withMetadata=true`),
    fetch(`${baseUrl}?owner=${walletAddress}&contractAddresses[]=${WOWG_CONTRACT}&withMetadata=true`),
  ]);

  if (!wowResponse.ok || !wowgResponse.ok) {
    const error = new Error('Failed to fetch NFTs from Alchemy');
    error.response = { status: wowResponse.status || wowgResponse.status };
    throw error;
  }

  const wowData = await wowResponse.json();
  const wowgData = await wowgResponse.json();

  // Transform Alchemy response to our NFT format
  const wowNFTs = (wowData.ownedNfts || []).map((nft) => transformAlchemyNFT(nft, 'WoW'));
  const wowgNFTs = (wowgData.ownedNfts || []).map((nft) => transformAlchemyNFT(nft, 'WoWG'));

  return [...wowNFTs, ...wowgNFTs];
}

/**
 * Transform Alchemy NFT format to our app's NFT format
 */
function transformAlchemyNFT(alchemyNFT, collection) {
  // Get the best available image URL
  const imageUrl =
    alchemyNFT.image?.cachedUrl ||
    alchemyNFT.image?.thumbnailUrl ||
    alchemyNFT.image?.pngUrl ||
    alchemyNFT.image?.originalUrl ||
    '';

  const metadata = alchemyNFT.raw?.metadata || {};

  return {
    tokenId: alchemyNFT.tokenId,
    contractAddress: alchemyNFT.contract?.address || '',
    imageUrl,
    name: metadata.name || `${collection} #${alchemyNFT.tokenId}`,
    collection,
    traits: metadata.attributes || [],
  };
}

/**
 * Validate Ethereum address format
 */
function isValidEthereumAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
