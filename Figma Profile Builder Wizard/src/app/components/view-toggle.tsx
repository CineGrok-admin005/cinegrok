import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from './ui/button';

interface ViewToggleProps {
  currentView: 'audience' | 'producer';
  onToggle: (view: 'audience' | 'producer') => void;
  isLoggedIn: boolean;
}

export function ViewToggle({ currentView, onToggle, isLoggedIn }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center bg-accent rounded-lg p-1 gap-1">
      <Button
        onClick={() => onToggle('audience')}
        variant={currentView === 'audience' ? 'default' : 'ghost'}
        size="sm"
        className="text-sm"
      >
        Audience View
      </Button>
      
      <Button
        onClick={() => isLoggedIn ? onToggle('producer') : null}
        variant={currentView === 'producer' ? 'default' : 'ghost'}
        size="sm"
        className="text-sm relative"
        disabled={!isLoggedIn}
      >
        Producer View
        {!isLoggedIn && (
          <Lock className="w-3 h-3 ml-2 text-muted" />
        )}
      </Button>
    </div>
  );
}
