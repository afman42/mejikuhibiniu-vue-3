/**
 * PWA Helper functions for Mejikuhibiniu game
 */

export interface PWAEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export class PWAService {
  private deferredPrompt: PWAEvent | null = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = this.checkSupport();
    this.init();
  }

  private checkSupport(): boolean {
    return ('serviceWorker' in navigator) && ('PushManager' in window);
  }

  private init(): void {
    if (!this.isSupported) return;

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e as PWAEvent;
      console.log('PWA install prompt deferred');
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.deferredPrompt = null;
    });
  }

  public isInstallable(): boolean {
    return this.isSupported && this.deferredPrompt !== null;
  }

  public async install(): Promise<boolean> {
    if (!this.isInstallable()) {
      return false;
    }

    // Show the install prompt
    await this.deferredPrompt!.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt!.userChoice;
    
    // Reset the deferred prompt
    this.deferredPrompt = null;
    
    return outcome === 'accepted';
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  public async checkServiceWorker(): Promise<boolean> {
    if (!this.isSupported) return false;
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration !== undefined && registration.active !== null;
    } catch {
      return false;
    }
  }

  public async refreshServiceWorker(): Promise<void> {
    if (!this.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Service worker updated');
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
    }
  }
}

// Create a singleton instance
export const pwaService = new PWAService();