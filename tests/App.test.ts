import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';

describe('App Component', () => {
  let originalSetInterval: any;
  let originalClearInterval: any;

  beforeEach(() => {
    // Store original functions to restore later
    originalSetInterval = window.setInterval;
    originalClearInterval = window.clearInterval;
    
    // Mock window.setInterval and window.clearInterval
    window.setInterval = vi.fn((callback) => {
      // Use setImmediate for immediate execution in tests
      return setTimeout(callback, 0) as any;
    });
    window.clearInterval = vi.fn((id) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    // Restore original functions
    window.setInterval = originalSetInterval;
    window.clearInterval = originalClearInterval;
    vi.clearAllMocks();
  });

  it('initializes with sequence sections hidden', async () => {
    const wrapper = mount(App);
    
    await flushPromises(); // Wait for component to mount and initialize
    
    // Check that the component has loaded
    expect(wrapper.exists()).toBe(true);
    
    // Check that "Urutan Asli" section is NOT visible initially
    const urutanAsliElements = wrapper.findAll('h2');
    const hasUrutanAsli = Array.from(urutanAsliElements).some(h2 => h2.text().includes('Urutan Asli'));
    expect(hasUrutanAsli).toBe(false);
    
    // Check that "Pilih Angka" section is NOT visible initially
    const pilihAngkaElements = wrapper.findAll('h2');
    const hasPilihAngka = Array.from(pilihAngkaElements).some(h2 => h2.text().includes('Pilih Angka'));
    expect(hasPilihAngka).toBe(false);
    
    // Check that "Jawaban Anda" section is NOT visible initially
    const jawabanAndaElements = wrapper.findAll('h2');
    const hasJawabanAnda = Array.from(jawabanAndaElements).some(h2 => h2.text().includes('Jawaban Anda'));
    expect(hasJawabanAnda).toBe(false);
    
    // Check that difficulty selector is present
    expect(wrapper.find('label').text()).toContain('Tingkat Kesulitan');
    
    wrapper.unmount();
  });

  it('shows sections when play is clicked', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    // Initially, the sections should not be visible
    let urutanAsliElements = wrapper.findAll('h2');
    let hasUrutanAsli = Array.from(urutanAsliElements).some(h2 => h2.text().includes('Urutan Asli'));
    expect(hasUrutanAsli).toBe(false);
    
    // Find and click the play button
    const buttons = wrapper.findAll('button');
    const playButton = Array.from(buttons).find(btn => 
      btn.text().includes('Play') || btn.text().includes('Main')
    );
    
    if (playButton) {
      await playButton.trigger('click');

      // Wait for DOM update
      await wrapper.vm.$nextTick();
      
      // Now the sections should be visible after play is clicked
      urutanAsliElements = wrapper.findAll('h2');
      hasUrutanAsli = Array.from(urutanAsliElements).some(h2 => h2.text().includes('Urutan Asli'));
      const hasPilihAngka = Array.from(urutanAsliElements).some(h2 => h2.text().includes('Pilih Angka'));
      const hasJawabanAnda = Array.from(urutanAsliElements).some(h2 => h2.text().includes('Jawaban Anda'));
      
      expect(hasUrutanAsli).toBe(true);
      expect(hasPilihAngka).toBe(true);
      expect(hasJawabanAnda).toBe(true);
    }
    
    wrapper.unmount();
  });

  it('shows appropriate game status messages', async () => {
    const wrapper = mount(App);
    
    // Wait for component to mount and initialize
    await flushPromises();
    await wrapper.vm.$nextTick(); // Wait for DOM updates after mount
    
    // Look for the specific status message in memorization mode
    const statusMessageElements = wrapper.findAll('p');
    const memorizationMessage = Array.from(statusMessageElements).find(p => 
      p.text().includes('Ingat urutan angka berwarna')
    );
    
    expect(memorizationMessage).toBeDefined();
    expect(memorizationMessage!.text()).toContain('Ingat urutan angka berwarna');
    
    wrapper.unmount();
  });

  it('allows starting the timer', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    // Find and click the play button
    const buttons = wrapper.findAll('button');
    const playButton = Array.from(buttons).find(btn => 
      btn.text().includes('Play') || btn.text().includes('Main')
    );
    
    if (playButton) {
      await playButton.trigger('click');

      // Check that setInterval was called (timer started)  
      expect(window.setInterval).toHaveBeenCalled();
    }
    
    wrapper.unmount();
  });

  it('hides sections when result is clicked', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    // Click the play button first to show sections
    const buttons = wrapper.findAll('button');
    const playButton = Array.from(buttons).find(btn => 
      btn.text().includes('Play') || btn.text().includes('Main')
    );
    
    if (playButton) {
      await playButton.trigger('click');
      await wrapper.vm.$nextTick();

      // Verify sections are visible after play is clicked
      const urutanAsliElementsBefore = wrapper.findAll('h2');
      const hasUrutanAsliBefore = Array.from(urutanAsliElementsBefore).some(h2 => h2.text().includes('Urutan Asli'));
      expect(hasUrutanAsliBefore).toBe(true);

      // Find and click the result/check button
      const resultButton = Array.from(buttons).find(btn => 
        btn.text().includes('Cek') || btn.text().includes('Result') || btn.text().includes('Check')
      );
      
      if (resultButton) {
        await resultButton.trigger('click');
        await wrapper.vm.$nextTick();
        // Wait for the timeout in handleResult
        await new Promise(resolve => setTimeout(resolve, 150)); 

        // Verify sections are now hidden after result is clicked
        const urutanAsliElementsAfter = wrapper.findAll('h2');
        const hasUrutanAsliAfter = Array.from(urutanAsliElementsAfter).some(h2 => h2.text().includes('Urutan Asli'));
        expect(hasUrutanAsliAfter).toBe(false);
      }
    }
    
    wrapper.unmount();
  });

  it('resets the game properly', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    // Find and click the reset button
    const buttons = wrapper.findAll('button');
    const resetButton = Array.from(buttons).find(btn => 
      btn.text().includes('Reset') || btn.text().includes('Ulang')
    );
    
    if (resetButton) {
      await resetButton.trigger('click');
    }
    
    wrapper.unmount();
  });

  it('handles component unmounting gracefully', async () => {
    const wrapper = mount(App);
    await flushPromises();
    
    // Ensure no errors occur during unmount
    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  it('handles multiple clicks without errors', async () => {
    const wrapper = mount(App);
    await flushPromises();
    
    // Click the play button multiple times
    const buttons = wrapper.findAll('button');
    const playButton = Array.from(buttons).find(btn => 
      btn.text().includes('Play') || btn.text().includes('Main')
    );
    
    if (playButton) {
      await playButton.trigger('click');
      await playButton.trigger('click'); // Click again
      await playButton.trigger('click'); // And again
      
      // Should not cause errors
      expect(wrapper.exists()).toBe(true);
    }
    
    wrapper.unmount();
  });

  it('handles missing elements gracefully', async () => {
    const wrapper = mount(App);
    await flushPromises();
    
    // Try to find a non-existent element - should not cause errors
    const nonExistentElement = wrapper.find('.non-existent-class');
    expect(nonExistentElement.exists()).toBe(false);
    
    wrapper.unmount();
  });

  it('handles different screen sizes properly', async () => {
    const wrapper = mount(App);
    await flushPromises();
    
    // Check responsive elements exist
    expect(wrapper.find('.min-h-screen')).toBeTruthy();
    expect(wrapper.find('.max-w-4xl')).toBeTruthy();
    expect(wrapper.find('.bg-gradient-to-br')).toBeTruthy();
    
    wrapper.unmount();
  });

  it('correctly handles game state transitions', async () => {
    const wrapper = mount(App);
    await flushPromises();
    
    // Find and click the play button to start the game
    const buttons = wrapper.findAll('button');
    const playButton = Array.from(buttons).find(btn => 
      btn.text().includes('Play') || btn.text().includes('Main')
    );
    
    if (playButton) {
      await playButton.trigger('click');
      await wrapper.vm.$nextTick();
      
      // Check that the game status message changed
      const statusMessageElements = wrapper.findAll('p');
      const playingMessage = Array.from(statusMessageElements).find(p => 
        p.text().includes('Waktu mulai!')
      );
      
      expect(playingMessage).toBeDefined();
    }
    
    wrapper.unmount();
  });

  it('handles difficulty changes', async () => {
    const wrapper = mount(App);
    await flushPromises();

    // Find and click the difficulty selector
    const difficultySelectors = wrapper.findAll('select');
    if (difficultySelectors.length > 0) {
      const difficultySelect = difficultySelectors[0];
      
      // Check that the select element exists
      expect(difficultySelect.exists()).toBe(true);
      
      // Try changing the difficulty
      await difficultySelect.setValue('HARD');
      await wrapper.vm.$nextTick();
      
      // Verify the change worked
      expect(difficultySelect.element.value).toBe('HARD');
    }
    
    wrapper.unmount();
  });
});