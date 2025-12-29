import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import PathSelectionPage from './pages/PathSelectionPage';
import IndividualReadingPage from './pages/IndividualReadingPage';
import ReadingPage from './pages/ReadingPage';
import ShareableReadingPage from './pages/ShareableReadingPage';
import NumerologyTestPage from './pages/NumerologyTestPage';
import InfoPage from './pages/InfoPage';

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
  const { isVerified, setAuthenticated, userPath } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleUnLock = (data: UserData) => {
    setUserData(data);
  };

  const handleBack = () => {
    setUserData(null);
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
              userPath ? (
                !userData ? (
                  <IndividualReadingPage onUnLock={handleUnLock} onBack={handleBack} />
                ) : (
                  <Navigate to="/share" replace />
                )
              ) : (
                <Navigate to="/choose-path" replace />
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

        <Route
          path="/share"
          element={
            isVerified && userData ? (
              <ShareableReadingPage userData={userData} onBack={handleBack} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Info page - accessible to all */}
        <Route path="/info" element={<InfoPage />} />

        {/* Test page - accessible without authentication */}
        <Route path="/test" element={<NumerologyTestPage />} />

        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
