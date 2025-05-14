import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AppLegacy, AppVersionHistory } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
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

  // La banner ha sido eliminada según petición del usuario
  return null;
}