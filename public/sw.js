// AskHire Service Worker for Enhanced Performance and SEO
// public/sw.js

const CACHE_NAME = 'askhire-v1.0.0';
const STATIC_CACHE_NAME = 'askhire-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'askhire-dynamic-v1.0.0';
const API_CACHE_NAME = 'askhire-api-v1.0.0';

// Resources to cache immediately - FIXED: Added error handling for individual assets
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/askhire.ico'
  // Note: Removed bundle.js and main.css as they might have dynamic names
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/jobs',
  '/api/companies'
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  CACHE_ONLY: 'cache-only',
  NETWORK_ONLY: 'network-only'
};

// FIXED: Helper function to safely cache assets with individual error handling
async function cacheAssetsIndividually(cache, assets) {
  const results = await Promise.allSettled(
    assets.map(async (asset) => {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
          console.log(`Service Worker: Successfully cached ${asset}`);
          return { asset, success: true };
        } else {
          console.warn(`Service Worker: Failed to fetch ${asset} - Status: ${response.status}`);
          return { asset, success: false, error: `HTTP ${response.status}` };
        }
      } catch (error) {
        console.warn(`Service Worker: Error caching ${asset}:`, error.message);
        return { asset, success: false, error: error.message };
      }
    })
  );
  
  const successful = results.filter(result => result.value?.success).length;
  const failed = results.filter(result => !result.value?.success);
  
  console.log(`Service Worker: Cached ${successful}/${assets.length} assets`);
  if (failed.length > 0) {
    console.warn('Service Worker: Failed to cache:', failed.map(f => f.value?.asset));
  }
  
  return results;
}

// FIXED: Install event with better error handling
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets with individual error handling
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        console.log('Service Worker: Caching static assets...');
        try {
          // Try to cache assets individually instead of using addAll
          await cacheAssetsIndividually(cache, STATIC_ASSETS);
        } catch (error) {
          console.error('Service Worker: Error during asset caching:', error);
          // Don't fail the installation even if some assets fail to cache
        }
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ]).catch(error => {
      console.error('Service Worker: Installation failed:', error);
      // Don't throw - allow SW to install even with partial failures
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// FIXED: Fetch event with better error handling
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip requests to external domains (except fonts and CDN resources)
  if (url.origin !== location.origin && !isAllowedExternalResource(url)) {
    return;
  }
  
  // Skip browser-extension requests
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// FIXED: Handle different types of requests with better error handling
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Static assets - Cache First
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    }
    
    // API requests - Network First with fallback
    if (isAPIRequest(pathname)) {
      return await networkFirstWithFallback(request, API_CACHE_NAME);
    }
    
    // Images - Cache First
    if (isImageRequest(pathname)) {
      return await cacheFirst(request, DYNAMIC_CACHE_NAME);
    }
    
    // Fonts - Cache First (long-term)
    if (isFontRequest(pathname)) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    }
    
    // HTML pages - Stale While Revalidate
    if (isHTMLRequest(request)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    }
    
    // External resources (CDN, fonts, etc.) - Cache First
    if (isAllowedExternalResource(url)) {
      return await cacheFirst(request, DYNAMIC_CACHE_NAME);
    }
    
    // Default to network first
    return await networkFirst(request, DYNAMIC_CACHE_NAME);
    
  } catch (error) {
    console.warn('Service Worker: Fetch error for', request.url, ':', error);
    
    // Return offline fallback for HTML requests
    if (isHTMLRequest(request)) {
      return await getOfflineFallback();
    }
    
    // For other requests, try to return from cache or throw
    try {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (cacheError) {
      console.warn('Service Worker: Cache lookup failed:', cacheError);
    }
    
    throw error;
  }
}

// FIXED: Cache First strategy with better error handling
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone the response before caching
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache).catch(error => {
        console.warn('Service Worker: Failed to cache response:', error);
      });
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Service Worker: Cache first failed for', request.url, ':', error);
    throw error;
  }
}

// FIXED: Network First strategy with better error handling
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone()).catch(error => {
        console.warn('Service Worker: Failed to cache network response:', error);
      });
    }
    
    return networkResponse;
  } catch (error) {
    try {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        console.log('Service Worker: Serving from cache after network failure:', request.url);
        return cachedResponse;
      }
    } catch (cacheError) {
      console.warn('Service Worker: Cache lookup failed:', cacheError);
    }
    
    throw error;
  }
}

// Network First with API fallback
async function networkFirstWithFallback(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone()).catch(error => {
        console.warn('Service Worker: Failed to cache API response:', error);
      });
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    try {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        console.log('Service Worker: Serving API from cache:', request.url);
        return cachedResponse;
      }
    } catch (cacheError) {
      console.warn('Service Worker: API cache lookup failed:', cacheError);
    }
    
    // Return fallback API response
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'You are currently offline. Please check your connection.',
        cached: false
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Start network request in background
    const networkResponsePromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone()).catch(error => {
          console.warn('Service Worker: Failed to update cache:', error);
        });
      }
      return networkResponse;
    }).catch(error => {
      console.warn('Service Worker: Background fetch failed:', error);
      return null;
    });
    
    // Return cached response immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Wait for network response if no cache
    const networkResponse = await networkResponsePromise;
    if (networkResponse) {
      return networkResponse;
    }
    
    throw new Error('No cached response and network failed');
  } catch (error) {
    console.warn('Service Worker: Stale while revalidate failed:', error);
    throw error;
  }
}

// Get offline fallback page
async function getOfflineFallback() {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const fallback = await cache.match('/');
    
    if (fallback) {
      return fallback;
    }
  } catch (error) {
    console.warn('Service Worker: Failed to get offline fallback from cache:', error);
  }
  
  // Create basic offline page
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AskHire - You're Offline</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: #f3f4f6;
          color: #374151;
        }
        .offline-container {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 400px;
        }
        .offline-title {
          color: #1f2937;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .offline-message {
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .retry-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
        }
        .retry-btn:hover {
          background: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1 class="offline-title">You're Offline</h1>
        <p class="offline-message">
          It looks like you're not connected to the internet. 
          Please check your connection and try again.
        </p>
        <p class="offline-message">
          Don't worry - your dream job is still waiting for you!
        </p>
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>`,
    {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'text/html'
      }
    }
  );
}

// Helper functions to identify request types
function isStaticAsset(pathname) {
  return pathname.startsWith('/static/') || 
         pathname.endsWith('.js') || 
         pathname.endsWith('.css') ||
         pathname.endsWith('.ico') ||
         pathname === '/manifest.json';
}

function isAPIRequest(pathname) {
  return pathname.startsWith('/api/') || API_ENDPOINTS.includes(pathname);
}

function isImageRequest(pathname) {
  return /\.(jpg|jpeg|png|gif|svg|webp|avif)$/i.test(pathname);
}

function isFontRequest(pathname) {
  return /\.(woff|woff2|ttf|otf|eot)$/i.test(pathname);
}

function isHTMLRequest(request) {
  const acceptHeader = request.headers.get('accept');
  return acceptHeader && acceptHeader.includes('text/html');
}

function isAllowedExternalResource(url) {
  const allowedDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'unpkg.com'
  ];
  
  return allowedDomains.some(domain => url.hostname.includes(domain));
}

// Background sync for offline job applications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-job-application') {
    event.waitUntil(syncJobApplications());
  }
});

// Sync job applications when back online
async function syncJobApplications() {
  try {
    // Get pending applications from IndexedDB
    const pendingApplications = await getPendingApplications();
    
    for (const application of pendingApplications) {
      try {
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(application)
        });
        
        if (response.ok) {
          await removePendingApplication(application.id);
        }
      } catch (error) {
        console.warn('Failed to sync application:', error);
      }
    }
  } catch (error) {
    console.warn('Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingApplications() {
  // Implement IndexedDB operations here
  return [];
}

async function removePendingApplication(id) {
  // Implement IndexedDB operations here
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'New job opportunities available!',
        icon: '/logo192.png',
        badge: '/logo192.png',
        data: data.url || '/',
        actions: [
          {
            action: 'view',
            title: 'View Jobs'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'AskHire', options)
      );
    } catch (error) {
      console.warn('Push notification error:', error);
    }
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MEASURE') {
    // Log performance metrics
    console.log('Performance measure:', event.data.measure);
  }
});

console.log('Service Worker: Loaded successfully');