import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AuthCallbackPageProps {
  onAuthenticated: (user: { id: string; username: string }, accessToken: string) => void;
}

export default function AuthCallbackPage({ onAuthenticated }: AuthCallbackPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'verifying' | 'error' | 'not-holder'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('verifying');

        // Get parameters from URL (redirected from backend API)
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const verified = searchParams.get('verified');
        const discordId = searchParams.get('discordId');
        const username = searchParams.get('username');
        const state = searchParams.get('state');

        // Check for errors
        if (error) {
          setErrorMessage(errorDescription || 'Authentication failed. Please try again.');
          setStatus('error');
          return;
        }

        // Validate we have the required data
        if (!verified || !discordId || !username) {
          setErrorMessage('Invalid callback data received.');
          setStatus('error');
          return;
        }

        // Verify CSRF token (state parameter)
        const storedState = sessionStorage.getItem('discord_oauth_state');
        if (storedState && state !== storedState) {
          setErrorMessage('Security validation failed. Please try again.');
          setStatus('error');
          return;
        }

        // Clear stored state
        sessionStorage.removeItem('discord_oauth_state');

        // Check if user is verified WoW holder
        if (verified !== 'true') {
          setStatus('not-holder');
          return;
        }

        // User is verified - save to state and redirect
        onAuthenticated(
          {
            id: discordId,
            username: username,
          },
          'backend_verified' // We don't expose the actual access token to frontend
        );

        navigate('/enter');
      } catch (err) {
        console.error('Auth callback error:', err);
        setErrorMessage('An error occurred during verification.');
        setStatus('error');
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden flex items-center justify-center">
      {/* Cosmic particles background */}
      <div className="cosmic-particles">
        {Array.from({ length: 50 }).map((_, i) => (
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

      <div className="relative z-10 text-center px-4 max-w-md">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-[#9B8DE3] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#F4E8DC] text-xl" style={{ fontFamily: "'Cinzel', serif" }}>
              Authenticating...
            </p>
          </div>
        )}

        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-[#F8A1D1] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#F4E8DC] text-xl" style={{ fontFamily: "'Cinzel', serif" }}>
              Verifying WoW Holder Status...
            </p>
          </div>
        )}

        {status === 'not-holder' && (
          <div className="glass-effect mystical-glow p-8 bg-gradient-to-br from-[#1D1B3A]/90 to-[#0C0A1E]/90 border-[#F8A1D1]/40 space-y-4">
            <div className="text-5xl mb-4">🔮</div>
            <h2
              className="text-2xl font-semibold text-[#F4E8DC] mb-4"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Not a WoW Holder
            </h2>
            <p className="text-[#F4E8DC]/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
              This experience is for verified World of Women holders.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white font-semibold rounded-lg transition-all duration-300"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Back to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="glass-effect mystical-glow p-8 bg-gradient-to-br from-[#1D1B3A]/90 to-[#0C0A1E]/90 border-red-400/40 space-y-4">
            <div className="text-5xl mb-4">⚠️</div>
            <h2
              className="text-2xl font-semibold text-[#F4E8DC] mb-4"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Authentication Error
            </h2>
            <p className="text-[#F4E8DC]/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {errorMessage}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#9B8DE3] to-[#F8A1D1] hover:from-[#8B7DD3] hover:to-[#E891C1] text-white font-semibold rounded-lg transition-all duration-300"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
