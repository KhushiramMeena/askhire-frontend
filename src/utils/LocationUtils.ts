// locationUtil.ts
// A utility function that handles location permission and caching

/**
 * Checks if user has already shared location (stored in cache)
 * If not, requests location permission using browser's native prompt
 * Stores country in localStorage for future access
 * Returns nothing
 */
export const initializeLocation = (): void => {
    // Check if we already have the country stored
    const cachedCountry = localStorage.getItem('userCountry');
    
    // If we already have the country, do nothing
    if (cachedCountry) {
      return;
    }
    
    // Make sure geolocation is supported
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }
    
    // Request geolocation permission from the browser
    navigator.geolocation.getCurrentPosition(
      // Success callback
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Convert coordinates to country using reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location data');
          }
          
          const data = await response.json();
          const country = data.countryName;
          
          // Store country in localStorage
          localStorage.setItem('userCountry', country);
        } catch (error) {
          console.error('Error getting country from coordinates:', error);
        }
      },
      // Error callback
      (error) => {
        console.error('Geolocation permission denied or error:', error.message);
      }
    );
  };
  
  /**
   * Access the stored country from anywhere in your app
   * Returns the stored country or null if not available
   */
  export const getUserCountry = (): string | null => {
    return localStorage.getItem('userCountry');
  };
  
  // Usage examples:
  
  // In your main App.tsx or index.tsx:
  // Import and call this once on app initialization
  // initializeLocation();
  
  // In any component that needs the country:
  // import { getUserCountry } from './locationUtil';
  // 
  // function YourComponent() {
  //   // Access the country whenever needed
  //   const country = getUserCountry();
  //   // Use country value...
  // }