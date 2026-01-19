import { projectId, publicAnonKey } from './supabase/info';
import { SponsoredAd } from '../components/SponsoredBanner';
import { safeFetch, isPreviewMode } from './apiHelper';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-016594ff`;

interface PublicBanner {
  id: string | number;
  mediaUrl: string;
  link: string;
  isActive: boolean;
}

export async function getAds(): Promise<SponsoredAd[]> {
  if (isPreviewMode()) {
    console.log('⚠️ Preview mode - Returning empty ads array');
    return [];
  }
  
  try {
    const response = await safeFetch(`${BASE_URL}/public/banners`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response || !response.ok) {
      console.warn(`Server returned ${response?.status || 'error'} for /public/banners`);
      return [];
    }
    
    const text = await response.text();
    let data: PublicBanner[];
    try {
        data = JSON.parse(text);
    } catch(e) {
        console.error("Failed to parse ads response:", text);
        return [];
    }

    if (!Array.isArray(data)) {
        console.warn("Server response for /public/banners is not an array:", data);
        return [];
    }

    // Map to SponsoredAd format used by the UI
    return data.map((b) => ({
        id: String(b.id),
        title: "", // Title is not provided in the simplified banner response
        description: "", // Description not provided
        imageUrl: b.mediaUrl,
        videoUrl: b.mediaUrl.match(/\.(mp4|webm)$/i) ? b.mediaUrl : undefined,
        ctaText: "Learn More",
        targetUrl: b.link,
        sponsor: "",
        isActive: b.isActive,
        impressions: 0,
        clicks: 0
    }));

  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}

// Legacy CRUD functions (kept if needed for internal admin usage, but read is now from public/banners)

export async function createAd(ad: Partial<SponsoredAd>): Promise<SponsoredAd | null> {
  // Not used by App, but kept for compatibility if needed
  return null;
}

export async function updateAd(id: string, ad: Partial<SponsoredAd>): Promise<SponsoredAd | null> {
  return null;
}

export async function deleteAd(id: string): Promise<boolean> {
  return false;
}

export async function trackAdClick(id: string): Promise<void> {
    if (isPreviewMode()) return;
    
    // Tracking might need adjustment if using different ID system, but skipping for now
    try {
        await safeFetch(`${BASE_URL}/ads/${id}/click`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
    } catch (e) { console.error(e); }
}

export async function trackAdImpression(id: string): Promise<void> {
    if (isPreviewMode()) return;
    
    try {
        await safeFetch(`${BASE_URL}/ads/${id}/impression`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
    } catch (e) { console.error(e); }
}