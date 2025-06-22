import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Avatar, Box } from '@mui/material';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  className?: string;
  borderRadius?: string | number;
  fallbackChar?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * OptimizedImage - An optimized image component with the following features:
 * - Lazy loading with Intersection Observer
 * - Responsive image sizes
 * - WebP and AVIF format support when available
 * - Blur-up loading effect
 * - Fallback to avatar with initials on error
 * - Accessible alt text
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  borderRadius = '0',
  fallbackChar,
  priority = false,
  objectFit = 'cover'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(priority);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Generate optimized versions of the image
  const getOptimizedImageSrc = useCallback((originalSrc: string) => {
    // Don't try to optimize data URLs or SVGs
    if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.endsWith('.svg')) {
      return originalSrc;
    }
    
    // Return original source if it's already a modern format
    if (originalSrc.includes('.webp') || originalSrc.includes('.avif')) {
      return originalSrc;
    }
    
    // For external images (non-origin), we can't manipulate - return as is
    try {
      const url = new URL(originalSrc, window.location.origin);
      if (!url.hostname.includes(window.location.hostname) && originalSrc.startsWith('http')) {
        return originalSrc;
      }
      
      // If we're dealing with our own images, we could add query params for optimization
      // For now, return the original URL
      return url.toString();
    } catch (e) {
      // If URL parsing fails, return the original
      return originalSrc;
    }
  }, []);

  // Generate placeholder image for blur-up effect
  const getPlaceholderImage = useCallback((originalSrc: string) => {
    // Create a tiny SVG placeholder with the right aspect ratio
    const w = typeof width === 'number' ? width : 100;
    const h = typeof height === 'number' ? height : 100;
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'%3E%3Crect width='${w}' height='${h}' fill='%23f0f0f0'/%3E%3C/svg%3E`;
  }, [width, height]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority) {
      return; // Skip observer for priority images
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Load images 200px before they come into view
        threshold: 0.01, // Trigger when 1% of the image is visible
      }
    );
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [priority]);

  if (imageError) {
    return (
      <Avatar 
        sx={{ 
          width, 
          height,
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          fontSize: '1.2rem',
          fontWeight: 600,
          borderRadius,
        }}
        className={className}
      >
        {fallbackChar || (alt && alt.charAt(0).toUpperCase())}
      </Avatar>
    );
  }

  const optimizedSrc = getOptimizedImageSrc(src);
  const placeholderSrc = getPlaceholderImage(src);

  return (
    <Box sx={{ position: 'relative', width, height, overflow: 'hidden', borderRadius }}>
      {!imageLoaded && (
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `url(${placeholderSrc})`,
            backgroundSize: 'cover',
            filter: 'blur(8px)',
            transform: 'scale(1.05)',
            borderRadius,
          }}
        />
      )}
      
      <picture>
        {/* Modern formats for better compression - only for jpg/jpeg/png conversions */}
        {optimizedSrc && (optimizedSrc.endsWith('.jpg') || optimizedSrc.endsWith('.jpeg') || optimizedSrc.endsWith('.png')) && (
          <>
            <source 
              type="image/webp" 
              srcSet={`${optimizedSrc.substring(0, optimizedSrc.lastIndexOf('.'))}.webp`} 
            />
            {/* AVIF offers even better compression than WebP but less support */}
            <source 
              type="image/avif" 
              srcSet={`${optimizedSrc.substring(0, optimizedSrc.lastIndexOf('.'))}.avif`} 
            />
          </>
        )}
        
        {(isInView || priority) ? (
          <img
            ref={imageRef}
            src={optimizedSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            style={{
              width: '100%',
              height: '100%',
              objectFit,
              borderRadius,
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        ) : (
          <div 
            ref={imageRef} 
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`, 
              backgroundColor: '#f0f0f0' 
            }} 
          />
        )}
      </picture>
    </Box>
  );
};

/**
 * Helper function to preload critical images
 * @param imageSrcs - Array of image URLs to preload
 */
export const preloadImages = (imageSrcs: string[]) => {
  imageSrcs.forEach(src => {
    if (src) {
      const img = new Image();
      img.src = src;
    }
  });
};

/**
 * Helper function to generate avatar placeholder
 * @param name - Name to generate initials from
 * @param bgColor - Background color (default: primary.main)
 */
export const getAvatarPlaceholder = (name: string, bgColor = 'primary.main') => {
  const initials = name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  
  return {
    initials,
    sx: {
      bgcolor: bgColor
    }
  };
}; 