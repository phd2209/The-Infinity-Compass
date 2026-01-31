import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import PathSelectionPage from './pages/PathSelectionPage';
import IndividualReadingPage from './pages/IndividualReadingPage';
import ReadingPage from './pages/ReadingPage';
import CurrentEnergyPage from './pages/CurrentEnergyPage';
import ShareableReadingPage from './pages/ShareableReadingPage';
import NumerologyTestPage from './pages/NumerologyTestPage';
import InfoPage from './pages/InfoPage';
// import YearForecastPage from './pages/YearForecastPage'; // Disabled until paid unlock is implemented
import TalismanPage from './pages/TalismanPage';

interface UserData {
  name: string;
  birthDate: Date;
  focusArea: string;
  gender?: 'woman' | 'man' | 'non-binary';
}

// Wrapper component to handle navigation after path selection
function PathSelectionPageWrapper() {
  const navigate = useNavigate();

  const handlePathSelected = () => {
    navigate('/enter');
  };

  return <PathSelectionPage onPathSelected={handlePathSelected} />;
}

function AppRoutes() {
  const { isVerified, setAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const handleUnLock = (data: UserData) => {
    setUserData(data);
  };

  // Back from entry page goes to login
  const handleBackFromEntry = () => {
    setUserData(null);
    navigate('/login');
  };

  // Back from profile page goes to current energy
  const handleBackFromProfile = () => {
    navigate('/current');
  };

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Login route - accessible to all */}
        <Route path="/login" element={<LoginPage />} />

        {/* OAuth callback route */}
        <Route
          path="/auth/callback"
          element={<AuthCallbackPage onAuthenticated={setAuthenticated} />}
        />

        {/* Path Selection Page - NEW intermediate step */}
        <Route
          path="/choose-path"
          element={
            isVerified ? (
              <PathSelectionPageWrapper />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected routes - require verification */}
        <Route
          path="/enter"
          element={
            isVerified ? (
              !userData ? (
                <IndividualReadingPage onUnLock={handleUnLock} onBack={handleBackFromEntry} />
              ) : (
                <Navigate to="/current" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/reading"
          element={
            isVerified && userData ? (
              <ReadingPage userData={userData} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Current Energy page - instant payoff moment */}
        <Route
          path="/current"
          element={
            isVerified && userData ? (
              <CurrentEnergyPage userData={userData} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Full Profile page - deep dive */}
        <Route
          path="/share"
          element={
            isVerified && userData ? (
              <ShareableReadingPage userData={userData} onBack={handleBackFromProfile} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Talisman product page */}
        <Route
          path="/talisman"
          element={
            isVerified && userData ? (
              <TalismanPage userData={userData} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Info page - accessible to all */}
        <Route path="/info" element={<InfoPage />} />

        {/* Test page - accessible without authentication */}
        <Route path="/test" element={<NumerologyTestPage />} />

        {/* Year Forecast page - disabled until paid unlock is implemented
        <Route path="/forecast" element={<YearForecastPage />} /> */}

        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
