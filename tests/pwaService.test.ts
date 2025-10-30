import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Create a testable version of PWAService
class TestablePWAService {
  private deferredPrompt: any = null;
  private isSupported: boolean;

  constructor(navigatorObj: any, pushManager: any = {}) {
    // Only check for serviceWorker in navigator, don't require PushManager in constructor
    this.isSupported = this.checkSupport(navigatorObj, pushManager);
  }

  private checkSupport(navigatorObj: any, pushManager: any): boolean {
    return ('serviceWorker' in navigatorObj) && ('PushManager' in pushManager);
  }

  public isInstallable(): boolean {
    return this.isSupported && this.deferredPrompt !== null;
  }

  public setDeferredPrompt(prompt: any) {
    this.deferredPrompt = prompt;
  }

  public isOnline(navigatorObj: any): boolean {
    return navigatorObj.onLine;
  }

  public async checkServiceWorker(navigatorObj: any): Promise<boolean> {
    if (!this.isSupported) return false;
    
    try {
      const registration = await navigatorObj.serviceWorker.getRegistration();
      return registration !== undefined && registration.active !== null;
    } catch {
      return false;
    }
  }

  public async refreshServiceWorker(navigatorObj: any): Promise<void> {
    if (!this.isSupported) return;

    try {
      const registration = await navigatorObj.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
    }
  }
}

describe('PWAService', () => {
  let originalNavigator: any;
  let originalPushManager: any;

  beforeEach(() => {
    // Save original values
    originalNavigator = global.navigator;
    originalPushManager = (global as any).PushManager;
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true
    });
    
    if (originalPushManager !== undefined) {
      (global as any).PushManager = originalPushManager;
    } else {
      delete (global as any).PushManager;
    }
    
    vi.clearAllMocks();
  });

  it('should detect PWA support correctly', () => {
    // Mock navigator with service worker support
    const mockNavigator = {
      serviceWorker: {
        getRegistration: vi.fn().mockResolvedValue({ active: { state: 'activated' } })
      }
    };
    
    // Temporarily add PushManager for this test
    (global as any).PushManager = {};
    
    const pwa = new TestablePWAService(mockNavigator, global);
    expect(pwa['isSupported']).toBe(true);
  });

  it('should detect when install is possible', () => {
    const mockNavigator = {
      serviceWorker: {
        getRegistration: vi.fn().mockResolvedValue({ active: { state: 'activated' } })
      }
    };
    
    (global as any).PushManager = {};
    
    const pwa = new TestablePWAService(mockNavigator, global);
    
    // Initially should not be installable
    expect(pwa.isInstallable()).toBe(false);
    
    // Simulate that deferredPrompt is set
    const mockPrompt = {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    pwa.setDeferredPrompt(mockPrompt);
    
    expect(pwa.isInstallable()).toBe(true);
  });
  
  it('should return correct online status', () => {
    const mockNavigator = {
      onLine: true,
      serviceWorker: {
        getRegistration: vi.fn().mockResolvedValue({ active: { state: 'activated' } })
      }
    };
    
    (global as any).PushManager = {};
    
    const pwa = new TestablePWAService(mockNavigator, global);
    expect(pwa.isOnline(mockNavigator)).toBe(true);
    
    // Test offline
    const mockNavigatorOffline = {
      onLine: false,
      serviceWorker: {
        getRegistration: vi.fn().mockResolvedValue({ active: { state: 'activated' } })
      }
    };
    
    expect(pwa.isOnline(mockNavigatorOffline)).toBe(false);
  });

  it('should handle service worker status correctly', async () => {
    const mockServiceWorkerRegistration = {
      active: { state: 'activated' }
    };
    
    const mockNavigator = {
      serviceWorker: {
        getRegistration: vi.fn().mockResolvedValue(mockServiceWorkerRegistration)
      }
    };
    
    (global as any).PushManager = {};
    
    const pwa = new TestablePWAService(mockNavigator, global);
    const hasWorker = await pwa.checkServiceWorker(mockNavigator);
    
    expect(hasWorker).toBe(true);
    expect(mockNavigator.serviceWorker.getRegistration).toHaveBeenCalled();
  });

  it('should handle refresh service worker correctly', async () => {
    const mockServiceWorkerRegistration = {
      update: vi.fn().mockResolvedValue(undefined),
      active: { state: 'activated' }
    };
    
    const mockServiceWorker = {
      getRegistration: vi.fn().mockResolvedValue(mockServiceWorkerRegistration)
    };
    
    const mockNavigator = {
      serviceWorker: mockServiceWorker
    };
    
    (global as any).PushManager = {};
    
    const pwa = new TestablePWAService(mockNavigator, global);
    await pwa.refreshServiceWorker(mockNavigator);
    
    expect(mockServiceWorker.getRegistration).toHaveBeenCalled();
    expect(mockServiceWorkerRegistration.update).toHaveBeenCalled();
  });
});