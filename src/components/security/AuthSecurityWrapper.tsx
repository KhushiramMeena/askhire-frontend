// src/components/security/CompleteAuthSecurityWrapper.tsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import crypto from 'crypto-js';

// A comprehensive security wrapper that protects against any localStorage tampering
const CompleteAuthSecurityWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, token, user, isAuthenticated, hydrated } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  
  // Create a comprehensive hash of ALL user data
  const generateUserDataHash = (userData: any): string => {
    if (!userData) return '';
    
    try {
      // Convert the entire user object to a string for hashing
      const userStr = JSON.stringify(userData);
      return crypto.SHA256(userStr).toString();
    } catch (error) {
      console.error('[Security] Error generating user data hash:', error);
      return '';
    }
  };
  
  // Generate a hash for the auth token
  const generateTokenHash = (authToken: string | null): string => {
    if (!authToken) return '';
    
    try {
      return crypto.SHA256(authToken).toString();
    } catch (error) {
      console.error('[Security] Error generating token hash:', error);
      return '';
    }
  };
  
  // Generate a combined security hash
  const generateSecurityHash = (userData: any, authToken: string | null): string => {
    if (!userData || !authToken) return '';
    
    try {
      const userHash = generateUserDataHash(userData);
      const tokenHash = generateTokenHash(authToken);
      return crypto.HmacSHA256(`${userHash}:${tokenHash}`, "COMPLETE_SECURITY_KEY").toString();
    } catch (error) {
      console.error('[Security] Error generating security hash:', error);
      return '';
    }
  };
  
  // Update all security hashes
  const updateSecurityHashes = () => {
    if (!user || !token) return;
    
    try {
      localStorage.setItem('user_hash', generateUserDataHash(user));
      localStorage.setItem('token_hash', generateTokenHash(token));
      
      // Store the combined security hash
      const securityHash = generateSecurityHash(user, token);
      localStorage.setItem('security_hash', securityHash);
    
    } catch (error) {
      console.error('[Security] Error updating security hashes:', error);
    }
  };
  
  // Perform a complete security check
  const performSecurityCheck = (): boolean => {
    if (!user || !token) return true;
    
    try {

      
      // Get stored hashes
      const storedUserHash = localStorage.getItem('user_hash');
      const storedTokenHash = localStorage.getItem('token_hash');
      const storedSecurityHash = localStorage.getItem('security_hash');
      
      // If any hash is missing, security is compromised
      if (!storedUserHash || !storedTokenHash || !storedSecurityHash) {
        console.warn('[Security] Missing security hashes');
        return false;
      }
      
      // Check user data integrity
      const currentUserHash = generateUserDataHash(user);
      if (currentUserHash !== storedUserHash) {
        console.warn('[Security] User data has been tampered with');
        return false;
      }
      
      // Get the token from localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken || storedToken !== token) {
        console.warn('[Security] Token mismatch or missing');
        return false;
      }
      
      // Check token integrity
      const currentTokenHash = generateTokenHash(token);
      if (currentTokenHash !== storedTokenHash) {
        console.warn('[Security] Token has been tampered with');
        return false;
      }
      
      // Check combined security hash
      const currentSecurityHash = generateSecurityHash(user, token);
      if (currentSecurityHash !== storedSecurityHash) {
        console.warn('[Security] Security hash mismatch');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[Security] Error during security check:', error);
      return false;
    }
  };
  
  // Verify localStorage state matches the store
  const verifyLocalStorageMatch = (): boolean => {
    try {
      // Get auth data from localStorage
      const authStorageStr = localStorage.getItem('auth-storage');
      if (!authStorageStr) return true;
      
      const authStorage = JSON.parse(authStorageStr);
      const storedUser = authStorage.state?.user;
      
      if (!storedUser || !user) return true;
      
      // Check if any user property has been modified
      // Use type-safe approach with Object.keys and type assertion
      const userProperties = Object.keys(user) as Array<keyof typeof user>;
      
      for (const prop of userProperties) {
        // Skip functions and complex objects
        if (typeof user[prop] === 'function') continue;
        if (typeof user[prop] === 'object' && user[prop] !== null) continue;
        
        // Convert both to string for comparison
        const currentValue = String(user[prop]);
        const storedValue = storedUser[prop] !== undefined ? String(storedUser[prop]) : undefined;
        
        if (currentValue !== storedValue) {
          console.warn(`[Security] Property '${String(prop)}' has been tampered with in localStorage.`);
          console.warn(`[Security] Expected: ${currentValue}, Found: ${storedValue}`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('[Security] Error verifying localStorage match:', error);
      return false;
    }
  };
  
  // Initialize security system
  useEffect(() => {
    if (hydrated) {
      if (isAuthenticated && user && token) {
        // First update the security hashes
        updateSecurityHashes();
        
        // Then verify security
        const isSecure = performSecurityCheck() && verifyLocalStorageMatch();
        
        if (!isSecure) {
          console.warn('[Security] Security check failed, logging out');
          logout();
          navigate('/login', { replace: true });
        }
      }
      
      setIsInitialized(true);
    }
  }, [hydrated, isAuthenticated, user, token, logout, navigate]);
  
  // Set up continuous monitoring
  useEffect(() => {
    if (!isAuthenticated || !user || !token) return;
    

    
    // Check security every few seconds
    const intervalId = setInterval(() => {
      const isSecure = performSecurityCheck() && verifyLocalStorageMatch();
      
      if (!isSecure) {
        console.warn('[Security] Security violation detected during monitoring, logging out');
        logout();
        navigate('/login', { replace: true });
      }
    }, 5000);
    
    // Monitor storage events (for cross-tab detection)
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is related to auth
      if (
        event.key === 'auth-storage' || 
        event.key === 'token' || 
        event.key === 'user_hash' ||
        event.key === 'token_hash' ||
        event.key === 'security_hash'
      ) {
        const isSecure = performSecurityCheck() && verifyLocalStorageMatch();
        
        if (!isSecure) {
          console.warn('[Security] Security violation detected from storage event, logging out');
          logout();
          navigate('/login', { replace: true });
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, user, token, logout, navigate]);
  
  // Update security hashes when auth state changes
  useEffect(() => {
    if (isAuthenticated && user && token) {
      updateSecurityHashes();
    }
  }, [isAuthenticated, user, token]);
  
  // Rendering section - no more loading spinner
  // The index.html loader will handle the initial loading state
  return <>{children}</>;
};

export default CompleteAuthSecurityWrapper;