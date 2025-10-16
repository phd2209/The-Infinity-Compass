import cache, { CacheKeys, TTL } from './utils/cache.js';

/**
 * Discord OAuth2 callback and verification endpoint
 * GET /api/verify-discord?code=...&state=...
 *
 * This endpoint:
 * 1. Exchanges the OAuth code for an access token
 * 2. Fetches user information
 * 3. Verifies user has required role (WoW or WoWG holder)
 * 4. Returns verification result with user data
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state } = req.query;

  // Validate OAuth callback parameters
  if (!code) {
    return res.status(400).json({
      error: 'invalid_request',
      message: 'Missing OAuth code parameter',
    });
  }

  // Check for required environment variables
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const guildId = process.env.WOW_GUILD_ID;

  if (!clientId || !clientSecret || !redirectUri || !guildId) {
    console.error('Discord OAuth not configured');
    return res.status(503).json({
      error: 'service_unavailable',
      message: 'Discord authentication is not configured',
    });
  }

  try {
    // Step 1: Exchange code for access token
    console.log('Exchanging OAuth code for access token...');
    const tokenData = await exchangeCodeForToken(code, clientId, clientSecret, redirectUri);

    if (!tokenData.access_token) {
      throw new Error('No access token received from Discord');
    }

    // Step 2: Fetch user information
    console.log('Fetching Discord user information...');
    const user = await fetchDiscordUser(tokenData.access_token);

    // Check cache for verification status
    const cacheKey = CacheKeys.discordVerified(user.id);
    const cachedVerification = cache.get(cacheKey);

    if (cachedVerification) {
      console.log('Cache hit for Discord verification:', user.id);
      return res.status(200).json({
        ...cachedVerification,
        cached: true,
      });
    }

    // Step 3: Verify user has required role
    console.log('Verifying WoW holder status...');
    const hasRole = await verifyWoWHolder(tokenData.access_token, guildId);

    const verificationResult = {
      verified: hasRole,
      discordId: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      globalName: user.global_name || user.username,
    };

    // Cache the verification result
    cache.set(cacheKey, verificationResult, TTL.DISCORD_VERIFIED);
    console.log(`Discord verification cached for ${TTL.DISCORD_VERIFIED} seconds`);

    // Redirect back to frontend with verification result
    const frontendCallbackUrl = process.env.FRONTEND_CALLBACK_URL || 'http://localhost:5173/auth/callback';

    // Encode the verification data as URL params
    const params = new URLSearchParams({
      verified: hasRole.toString(),
      discordId: user.id,
      username: user.global_name || user.username,
      state: state || '',
    });

    // Redirect to frontend callback
    return res.redirect(302, `${frontendCallbackUrl}?${params.toString()}`);
  } catch (error) {
    console.error('Error in Discord verification:', error);

    // Redirect to frontend with error
    const frontendCallbackUrl = process.env.FRONTEND_CALLBACK_URL || 'http://localhost:5173/auth/callback';
    const params = new URLSearchParams({
      error: 'verification_failed',
      error_description: error.message || 'Failed to verify Discord account',
    });

    return res.redirect(302, `${frontendCallbackUrl}?${params.toString()}`);
  }
}

/**
 * Exchange OAuth code for access token
 */
async function exchangeCodeForToken(code, clientId, clientSecret, redirectUri) {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
  }

  return response.json();
}

/**
 * Fetch Discord user information using access token
 */
async function fetchDiscordUser(accessToken) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user');
  }

  return response.json();
}

/**
 * Fetch user's guild member information to check roles
 */
async function fetchGuildMember(accessToken, guildId) {
  const response = await fetch(
    `https://discord.com/api/users/@me/guilds/${guildId}/member`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch guild member data');
  }

  return response.json();
}

/**
 * Verify if user has any of the required WoW holder roles (WoW or WoWG)
 */
async function verifyWoWHolder(accessToken, guildId) {
  try {
    const member = await fetchGuildMember(accessToken, guildId);

    // Get required role IDs from environment
    const requiredRoleIds = [
      process.env.WOW_ROLE_ID,
      process.env.WOWG_ROLE_ID,
    ].filter(Boolean); // Remove empty strings

    if (requiredRoleIds.length === 0) {
      console.warn('No required role IDs configured, allowing all users');
      return true; // Allow if no roles configured (for testing)
    }

    // Check if user has ANY of the required role IDs
    const hasRole = requiredRoleIds.some(roleId => member.roles.includes(roleId));

    console.log('User roles:', member.roles);
    console.log('Required roles:', requiredRoleIds);
    console.log('Has required role:', hasRole);

    return hasRole;
  } catch (error) {
    console.error('Error verifying WoW holder:', error);
    return false;
  }
}
