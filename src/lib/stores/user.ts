import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types';
import { ApiService } from '$lib/services/api';
import { browser } from '$app/environment';

// User store
export const user = writable<User | null>(null);
export const isAuthenticated = derived(user, $user => $user !== null);
export const isLoading = writable(false);

// Authentication actions
export const userActions = {
  async login(email: string, password: string) {
    isLoading.set(true);
    try {
      const response = await ApiService.login(email, password);
      if (response.success && response.data) {
        user.set(response.data);
        if (browser) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      isLoading.set(false);
    }
  },

  async register(email: string, password: string, name: string) {
    isLoading.set(true);
    try {
      const response = await ApiService.register(email, password, name);
      if (response.success && response.data) {
        user.set(response.data);
        if (browser) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      isLoading.set(false);
    }
  },

  async logout() {
    isLoading.set(true);
    try {
      await ApiService.logout();
      user.set(null);
      if (browser) {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      isLoading.set(false);
    }
  },

  async loadFromStorage() {
    if (browser) {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          // Verify user is still valid with API
          const response = await ApiService.getCurrentUser();
          if (response.success && response.data) {
            user.set(response.data);
          } else {
            localStorage.removeItem('user');
          }
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
    }
  },

  updateBalance(newBalance: number) {
    user.update(currentUser => {
      if (currentUser) {
        return { ...currentUser, balance: newBalance };
      }
      return currentUser;
    });
  },

  updateProfile(updates: Partial<User>) {
    user.update(currentUser => {
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        if (browser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return updatedUser;
      }
      return currentUser;
    });
  }
};

// Initialize user from storage on app start
if (browser) {
  userActions.loadFromStorage();
}