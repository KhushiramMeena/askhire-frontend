import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface AdBannerProps {
  slotId: string;
  format?: 'auto' | 'rectangle' | 'leaderboard' | 'banner' | 'skyscraper';
  responsive?: boolean;
  style?: React.CSSProperties;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  slotId, 
  format = 'auto', 
  responsive = true,
  style = {} 
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(false);

  // Get dimensions based on format
  const getAdDimensions = () => {
    switch (format) {
      case 'leaderboard':
        return { width: 728, height: 90 };
      case 'banner':
        return { width: 468, height: 60 };
      case 'rectangle':
        return { width: 300, height: 250 };
      case 'skyscraper':
        return { width: 160, height: 600 };
      default:
        return { width: 'auto', height: 'auto' };
    }
  };

  const dimensions = getAdDimensions();

  useEffect(() => {
    // Skip in development due to fake publisher ID
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // Prevent double mounting in React Strict Mode
    if (mountedRef.current) {
      return;
    }
    mountedRef.current = true;

    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          // Check if ad is already loaded
          const existingAd = adRef.current.querySelector('.adsbygoogle');
          if (existingAd && existingAd.getAttribute('data-ad-status')) {
            return; // Ad already loaded
          }

          // Clear any existing content
          adRef.current.innerHTML = '';
          
          // Create fresh ad element
          const adElement = document.createElement('ins');
          adElement.className = 'adsbygoogle';
          adElement.style.display = 'block';
          adElement.setAttribute('data-ad-client', process.env.REACT_APP_ADSENSE_PUBLISHER_ID || '');
          adElement.setAttribute('data-ad-slot', slotId);
          
          if (responsive) {
            adElement.setAttribute('data-ad-format', 'auto');
            adElement.setAttribute('data-full-width-responsive', 'true');
          } else {
            if (dimensions.width !== 'auto') {
              adElement.style.width = `${dimensions.width}px`;
              adElement.style.height = `${dimensions.height}px`;
            }
          }

          adRef.current.appendChild(adElement);

          // Initialize AdSense
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (error) {
        console.error('AdSense error:', error);
        setHasError(true);
      }
    };

    // Load ad after a short delay to ensure proper dimensions
    const timer = setTimeout(loadAd, 100);

    return () => {
      clearTimeout(timer);
      mountedRef.current = false;
    };
  }, [slotId, format, responsive, dimensions.width, dimensions.height]);

  // Development placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <Box
        sx={{
          width: dimensions.width === 'auto' ? '100%' : dimensions.width,
          height: dimensions.height === 'auto' ? 120 : dimensions.height,
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
          fontFamily: 'monospace',
          ...style
        }}
      >
        AdSense Placeholder ({format})
      </Box>
    );
  }

  // Error state
  if (hasError) {
    return (
      <Box
        sx={{
          width: dimensions.width === 'auto' ? '100%' : dimensions.width,
          height: 60,
          backgroundColor: '#fafafa',
          border: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px',
          ...style
        }}
      >
        Advertisement
      </Box>
    );
  }

  return (
    <Box
      component="div"
      ref={adRef}
      sx={{
        width: responsive ? '100%' : dimensions.width,
        minHeight: responsive ? 90 : dimensions.height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        ...style,
        // Ensure minimum dimensions for AdSense
        '& .adsbygoogle': {
          minWidth: responsive ? '300px' : 'auto',
          minHeight: responsive ? '90px' : 'auto',
        }
      }}
      aria-label="Advertisement"
    />
  );
};

export default AdBanner;