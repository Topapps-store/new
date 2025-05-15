import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AppLegacy, AppVersionHistory } from '@shared/schema';

import { Button } from '@/components/ui/button';
import { X, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type AppUpdate = {
  app: AppLegacy;
  versionHistory: AppVersionHistory;
};

export function AppUpdatesBanner() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // Fetch unnotified updates
  const { data: updates = [], isLoading } = useQuery<AppUpdate[]>({
    queryKey: ['/api/app-updates/unnotified'],
    retry: 1,
  });

  // Reset current index when updates change
  useEffect(() => {
    setCurrentIndex(0);
  }, [updates.length]);

  // Don't show if no updates or if dismissed
  if (isLoading || updates.length === 0 || isDismissed) {
    return null;
  }

  const currentUpdate = updates[currentIndex];
  const hasMultipleUpdates = updates.length > 1;

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? updates.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === updates.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 relative flex items-center">
      <div className="absolute right-2 top-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Bell className="text-blue-500 mr-3 h-5 w-5 flex-shrink-0" />
      
      <div className="flex-grow pr-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">{currentUpdate.app.name}</span>
          <span className="text-xs text-blue-800">
            {t('updates.newVersion')} {currentUpdate.versionHistory.version}
          </span>
        </div>
        
        <p className="text-sm text-slate-700">{currentUpdate.versionHistory.releaseNotes || t('updates.appUpdated')}</p>
        
        <div className="text-xs text-slate-500 mt-1">
          {t('updates.updated')}: {currentUpdate.versionHistory.updateDate ? new Date(currentUpdate.versionHistory.updateDate).toLocaleDateString() : ''}
        </div>
      </div>
      
      {hasMultipleUpdates && (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-xs text-slate-500">
            {currentIndex + 1}/{updates.length}
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}