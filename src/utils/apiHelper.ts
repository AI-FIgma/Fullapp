/**
 * API Helper Utility
 * Detects preview mode and prevents server calls that cause HTTP errors
 */

import { projectId, publicAnonKey } from './supabase/info';

/**
 * Check if running in Figma preview or development mode
 */
export function isPreviewMode(): boolean {
  // Check if environment variables are missing or empty
  const hasEnvVars = projectId && publicAnonKey && 
                     projectId !== '' && publicAnonKey !== '' &&
                     projectId !== 'undefined' && publicAnonKey !== 'undefined';
  
  // Check hostname patterns
  const isPreviewHost = 
    window.location.hostname.includes('figmaiframepreview') || 
    window.location.hostname.includes('figma.site') ||
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('127.0.0.1');
  
  return !hasEnvVars || isPreviewHost;
}

/**
 * Safe API fetch wrapper that prevents requests in preview mode
 */
export async function safeFetch(url: string, options?: RequestInit): Promise<Response | null> {
  if (isPreviewMode()) {
    console.log('⚠️ Preview mode - Skipping API call:', url);
    // Return a fake 503 response
    return new Response(
      JSON.stringify({ error: 'Server disabled in preview mode' }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  try {
    return await fetch(url, options);
  } catch (error) {
    console.error('API fetch error:', error);
    return null;
  }
}

/**
 * Get server base URL
 */
export function getServerUrl(): string {
  if (isPreviewMode()) {
    return ''; // Empty URL in preview mode
  }
  return `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
}

/**
 * Check if server is available
 */
export function isServerAvailable(): boolean {
  return !isPreviewMode();
}
