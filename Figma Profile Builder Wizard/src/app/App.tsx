import React, { useState } from 'react';
import { ProfileWizard } from './components/profile-wizard';
import { AudienceView } from './components/audience-view';
import { ProducerView } from './components/producer-view';
import { ViewToggle } from './components/view-toggle';
import { Button } from './components/ui/button';
import { ProfileData } from './types/profile';
import { mockProfile } from './data/mock-profile';
import { User, LogIn, LogOut } from 'lucide-react';

type AppMode = 'wizard' | 'profile';
type ViewMode = 'audience' | 'producer';

export default function App() {
  const [mode, setMode] = useState<AppMode>('profile'); // Start with profile view to showcase
  const [viewMode, setViewMode] = useState<ViewMode>('audience');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(mockProfile); // Use mock profile

  const handleWizardComplete = (data: ProfileData) => {
    setProfile(data);
    setMode('profile');
  };

  const handleViewToggle = (view: ViewMode) => {
    if (view === 'producer' && !isLoggedIn) return;
    setViewMode(view);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Top Navigation */}
      {mode === 'profile' && (
        <div className="sticky top-0 z-50 bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-8">
                <h1 className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>
                  CineGrok
                </h1>
                
                {/* Mode Switcher (Demo Controls) */}
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    onClick={() => setMode('wizard')}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    <User className="w-3 h-3 mr-2" />
                    Create Profile
                  </Button>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <ViewToggle
                  currentView={viewMode}
                  onToggle={handleViewToggle}
                  isLoggedIn={isLoggedIn}
                />

                {/* Login Toggle (Demo) */}
                <Button
                  onClick={() => {
                    setIsLoggedIn(!isLoggedIn);
                    if (isLoggedIn && viewMode === 'producer') {
                      setViewMode('audience');
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex"
                >
                  {isLoggedIn ? (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Producer Login
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {mode === 'wizard' ? (
        <ProfileWizard onComplete={handleWizardComplete} />
      ) : profile ? (
        <>
          {viewMode === 'audience' ? (
            <AudienceView profile={profile} />
          ) : (
            <ProducerView profile={profile} />
          )}
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Welcome to CineGrok
            </h1>
            <p className="text-muted mb-8">
              Create your filmmaker profile to get started
            </p>
            <Button onClick={() => setMode('wizard')} size="lg">
              Create Profile
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation (for profile mode) */}
      {mode === 'profile' && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-border">
          <div className="grid grid-cols-3 gap-2 p-3">
            <Button
              onClick={() => setMode('wizard')}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              <User className="w-4 h-4 mr-1" />
              Create
            </Button>
            
            <Button
              onClick={() => {
                setIsLoggedIn(!isLoggedIn);
                if (isLoggedIn && viewMode === 'producer') {
                  setViewMode('audience');
                }
              }}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </>
              )}
            </Button>
            
            <div className="flex justify-end">
              <span className="text-xs text-muted px-2 py-1 bg-accent rounded">
                {isLoggedIn ? 'Producer' : 'Guest'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
