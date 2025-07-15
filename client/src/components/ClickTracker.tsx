import React, { useEffect, useRef, useState } from 'react';

interface ClickData {
  appId: string;
  ipAddress?: string;
  userAgent: string;
  clickTimestamp: string;
  referrer: string;
  screenResolution: string;
  timezone: string;
  mouseMovements: number;
  keyboardEvents: number;
  scrollEvents: number;
  clickDuration: number;
  pageViewDuration: number;
}

interface ClickTrackerProps {
  appId: string;
  onClickData?: (data: ClickData) => void;
  children: React.ReactNode;
}

export default function ClickTracker({ appId, onClickData, children }: ClickTrackerProps) {
  const [mouseMovements, setMouseMovements] = useState(0);
  const [keyboardEvents, setKeyboardEvents] = useState(0);
  const [scrollEvents, setScrollEvents] = useState(0);
  const [clickStartTime, setClickStartTime] = useState<number | null>(null);
  const [pageStartTime] = useState(Date.now());
  const trackingRef = useRef<HTMLDivElement>(null);

  // Track mouse movements
  useEffect(() => {
    const handleMouseMove = () => {
      setMouseMovements(prev => prev + 1);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track keyboard events
  useEffect(() => {
    const handleKeyDown = () => {
      setKeyboardEvents(prev => prev + 1);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollEvents(prev => prev + 1);
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseDown = () => {
    setClickStartTime(Date.now());
  };

  const handleClick = async (event: React.MouseEvent) => {
    const clickEndTime = Date.now();
    const clickDuration = clickStartTime ? clickEndTime - clickStartTime : 0;
    const pageViewDuration = clickEndTime - pageStartTime;

    // Gather click data
    const clickData: ClickData = {
      appId,
      userAgent: navigator.userAgent,
      clickTimestamp: new Date().toISOString(),
      referrer: document.referrer,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      mouseMovements,
      keyboardEvents,
      scrollEvents,
      clickDuration,
      pageViewDuration
    };

    // Call the callback if provided
    if (onClickData) {
      onClickData(clickData);
    }

    // Send to fraud detection API
    try {
      const response = await fetch('/api/fraud-protection/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clickData),
      });

      const result = await response.json();
      
      // If click is blocked, prevent default action
      if (!result.allowed) {
        event.preventDefault();
        event.stopPropagation();
        
        // Show user feedback
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
        toast.textContent = 'Click blocked for security reasons';
        document.body.appendChild(toast);
        
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);
        
        return false;
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      // Allow click to proceed if tracking fails
    }
  };

  return (
    <div 
      ref={trackingRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="contents"
    >
      {children}
    </div>
  );
}

// Hook for manual click tracking
export function useClickTracker(appId: string) {
  const [mouseMovements, setMouseMovements] = useState(0);
  const [keyboardEvents, setKeyboardEvents] = useState(0);
  const [scrollEvents, setScrollEvents] = useState(0);
  const [pageStartTime] = useState(Date.now());

  // Track mouse movements
  useEffect(() => {
    const handleMouseMove = () => {
      setMouseMovements(prev => prev + 1);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track keyboard events
  useEffect(() => {
    const handleKeyDown = () => {
      setKeyboardEvents(prev => prev + 1);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollEvents(prev => prev + 1);
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  const trackClick = async (additionalData: Partial<ClickData> = {}) => {
    const clickData: ClickData = {
      appId,
      userAgent: navigator.userAgent,
      clickTimestamp: new Date().toISOString(),
      referrer: document.referrer,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      mouseMovements,
      keyboardEvents,
      scrollEvents,
      clickDuration: 0,
      pageViewDuration: Date.now() - pageStartTime,
      ...additionalData
    };

    try {
      const response = await fetch('/api/fraud-protection/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clickData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error tracking click:', error);
      return { allowed: true, reason: 'Tracking failed', riskScore: 0 };
    }
  };

  return {
    trackClick,
    mouseMovements,
    keyboardEvents,
    scrollEvents,
    pageViewDuration: Date.now() - pageStartTime
  };
}