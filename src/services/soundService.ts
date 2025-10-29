// Simple sound service using Web Audio API
class SoundService {
  private context: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.loadSettings();
    
    // Try to initialize AudioContext on load
    this.initAudioContext();
    
    // Add event listeners to handle context resume for autoplay policies
    if (typeof window !== 'undefined') {
      // Handle any user interaction to enable audio
      const handleInteraction = () => {
        if (this.context && this.context.state === 'suspended') {
          this.context.resume().catch(e => {
            console.warn('Failed to resume AudioContext:', e);
          });
        }
        // Remove listeners after first interaction
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
      };
      
      // Listen for the first user interaction
      window.addEventListener('click', handleInteraction, { once: true, passive: true });
      window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
      window.addEventListener('keydown', handleInteraction, { once: true, passive: true });
    }
  }

  private initAudioContext() {
    if (!this.context) {
      try {
        // AudioContext needs to be initialized after user interaction for modern browsers
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Resume context if suspended (happens with autoplay policies)
        if (this.context.state === 'suspended') {
          this.context.resume().catch(e => {
            console.warn('Failed to resume AudioContext on init:', e);
          });
        }
      } catch (e) {
        console.warn('Web Audio API is not supported in this browser');
        return false;
      }
    }
    return true;
  }

  private loadSettings() {
    const savedEnabled = localStorage.getItem('soundEnabled');
    const savedVolume = localStorage.getItem('soundVolume');
    
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true';
    }
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
  }

  private saveSettings() {
    localStorage.setItem('soundEnabled', this.enabled.toString());
    localStorage.setItem('soundVolume', this.volume.toString());
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.saveSettings();
  }

  public setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume)); // Clamp between 0 and 1
    this.saveSettings();
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  private playTone(frequency: number, duration: number) {
    if (!this.enabled) return;

    // Initialize audio context if needed
    if (!this.initAudioContext() || !this.context) {
      return; // Audio not available
    }

    try {
      // Check if context is still running before attempting to play sound
      if (this.context.state !== 'running') {
        console.warn('AudioContext not running, attempting to resume...');
        this.context.resume().catch(e => {
          console.warn('Could not resume AudioContext:', e);
          return; // Cannot play sound if we can't resume context
        });
      }

      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = this.volume;

      oscillator.start();
      oscillator.stop(this.context.currentTime + duration / 1000);

      // Clean up after playback
      setTimeout(() => {
        try {
          oscillator.disconnect();
          gainNode.disconnect();
        } catch (e) {
          // Ignore errors during disconnect
        }
      }, duration);
    } catch (e) {
      console.warn('Error playing sound:', e);
    }
  }

  public playSelectSound() {
    this.playTone(523.25, 50); // C5 note for 50ms
  }

  public playRemoveSound() {
    this.playTone(392.00, 50); // G4 note for 50ms
  }

  public playWinSound() {
    // Play a sequence of notes for winning
    this.playTone(523.25, 100); // C5
    setTimeout(() => this.playTone(659.25, 100), 100); // E5
    setTimeout(() => this.playTone(783.99, 200), 200); // G5
  }

  public playLoseSound() {
    // Play a descending sequence for losing
    this.playTone(523.25, 100); // C5
    setTimeout(() => this.playTone(392.00, 100), 100); // G4
    setTimeout(() => this.playTone(329.63, 200), 200); // E4
  }

  public playStartSound() {
    this.playTone(659.25, 100); // E5
  }
}

export const soundService = new SoundService();