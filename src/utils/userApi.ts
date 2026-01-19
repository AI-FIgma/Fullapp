import { projectId, publicAnonKey } from './supabase/info';
import { User } from '../App';
import { safeFetch, getServerUrl, isPreviewMode } from './apiHelper';

const BASE_URL = getServerUrl();

export async function getAllUsers(): Promise<User[]> {
  if (isPreviewMode()) {
    console.log('⚠️ Preview mode - Returning empty users array');
    return [];
  }
  
  try {
    const response = await safeFetch(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response || !response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const text = await response.text();
    const data = JSON.parse(text, (key, value) => {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}

export async function getUserProfile(userId: string): Promise<Partial<User> | null> {
  if (isPreviewMode()) {
    console.log('⚠️ Preview mode - Returning null for user profile');
    return null;
  }
  
  try {
    const response = await safeFetch(`${BASE_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response || !response.ok) {
      if (response?.status === 404) return null;
      throw new Error('Failed to fetch user profile');
    }
    
    const text = await response.text();
    // Use a reviver to restore Date objects
    const data = JSON.parse(text, (key, value) => {
      // Simple ISO date regex
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<Partial<User> | null> {
  if (isPreviewMode()) {
    console.log('⚠️ Preview mode - Skipping user profile update');
    return data; // Return the data as-is in preview mode
  }
  
  try {
    const response = await safeFetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response || !response.ok) {
      throw new Error('Failed to update user profile');
    }
    
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}