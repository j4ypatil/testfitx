import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { getHasSeenSplash, setHasSeenSplash, getOnboarding } from './utils/storage.js';
import SplashScreen from './components/SplashScreen.jsx';
import OnboardingFlow from './components/Onboarding/OnboardingFlow.jsx';
import SafeTab from './components/SafeTab.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Dashboard from './components/Home/Dashboard.jsx';
import WorkoutSection from './components/Workout/WorkoutSection.jsx';
import ProgressPage from './components/ProgressPage.jsx';
import ProfilePage from './components/Profile/ProfilePage.jsx';
import CommunityPage from './components/Community/CommunityPage.jsx';
import BottomNav from './components/BottomNav.jsx';
import EmailAuthScreen from './components/Auth/EmailAuthScreen.jsx';
import ConfirmSuccess from './components/Auth/ConfirmSuccess.jsx';

function AppContent() {
  const { user, loading, isSupabaseConfigured } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [onboarding, setOnboarding] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#121212';
    const seen = getHasSeenSplash();
    if (seen) setShowSplash(false);
    const data = getOnboarding();
    if (data) setOnboarding(data);
    setReady(true);
  }, []);

  if (loading || !ready) {
    return <div className="min-h-screen bg-dark-bg" />;
  }

  if (isSupabaseConfigured && !user) {
    return <EmailAuthScreen />;
  }

  if (showSplash) {
    return <SplashScreen onStart={() => { setHasSeenSplash(); setShowSplash(false); }} />;
  }

  if (!onboarding) {
    return <OnboardingFlow onComplete={(data) => { setOnboarding(data); }} />;
  }

  const tabs = [
    <SafeTab key="dash"><Dashboard onboarding={onboarding} /></SafeTab>,
    <SafeTab key="workout"><WorkoutSection /></SafeTab>,
    <SafeTab key="progress"><ProgressPage onboarding={onboarding} /></SafeTab>,
    <SafeTab key="community"><CommunityPage /></SafeTab>,
    <SafeTab key="profile"><ProfilePage onboarding={onboarding} setOnboarding={setOnboarding} /></SafeTab>,
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-foreground pb-28">
      <div className="max-w-md mx-auto px-4 pt-2">
        <div className="animate-fadeIn" key={activeTab}>
          {tabs[activeTab]}
        </div>
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  const [pendingConfirm] = useState(() => window.location.hash.includes('type=signup'));

  if (pendingConfirm) {
    return <ConfirmSuccess />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
