import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import IndividualReadingPage from './pages/IndividualReadingPage';
import ReadingPage from './pages/ReadingPage';
import ShareableReadingPage from './pages/ShareableReadingPage';
import NumerologyTestPage from './pages/NumerologyTestPage';

interface UserData {
  name: string;
  birthDate: Date;
  focusArea: string;
}

function AppRoutes() {
  const { isVerified, setAuthenticated } = useAuth();
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

        {/* Protected routes - require verification */}
        <Route
          path="/enter"
          element={
            isVerified ? (
              !userData ? (
                <IndividualReadingPage onUnLock={handleUnLock} onBack={handleBack} />
              ) : (
                <Navigate to="/share" replace />
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
