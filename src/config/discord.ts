// Discord OAuth2 Configuration
// Now using backend API for secure OAuth flow
export const DISCORD_CONFIG = {
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID || '',
  // Redirect to backend API endpoint that handles OAuth
  redirectUri: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/verify-discord`
    : 'http://localhost:3001/api/verify-discord', // Use Vercel dev port
  scope: 'identify guilds.members.read',
  responseType: 'code', // Changed from 'token' to 'code' for authorization code flow
  // Frontend callback to receive verification result
  frontendCallbackUri: 'http://localhost:5173/auth/callback',
};

export const getDiscordAuthUrl = (): string => {
  // Generate a random state for CSRF protection
  const state = generateRandomState();
  // Store state in sessionStorage for verification on callback
  sessionStorage.setItem('discord_oauth_state', state);

  const params = new URLSearchParams({
    client_id: DISCORD_CONFIG.clientId,
    redirect_uri: DISCORD_CONFIG.redirectUri,
    response_type: DISCORD_CONFIG.responseType,
    scope: DISCORD_CONFIG.scope,
    state: state,
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
};

// Generate random state for CSRF protection
function generateRandomState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
