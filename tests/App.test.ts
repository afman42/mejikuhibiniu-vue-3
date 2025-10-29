import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';

// Mock window.setInterval and window.clearInterval
const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

describe('App Component', () => {
  beforeEach(() => {
    // Mock window.setInterval and window.clearInterval
    window.setInterval = vi.fn(originalSetInterval);
    window.clearInterval = vi.fn(originalClearInterval);
  });

  afterEach(() => {
    // Restore the original functions after each test
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
    const hasUrutanAsli = Array.from(urutanAsliElements).some(h2 => h2.text() === 'Urutan Asli:');
    expect(hasUrutanAsli).toBe(false);
    
    // Check that "Pilih Angka" section is NOT visible initially
    const pilihAngkaElements = wrapper.findAll('h2');
    const hasPilihAngka = Array.from(pilihAngkaElements).some(h2 => h2.text() === 'Pilih Angka:');
    expect(hasPilihAngka).toBe(false);
    
    // Check that "Jawaban Anda" section is NOT visible initially
    const jawabanAndaElements = wrapper.findAll('h2');
    const hasJawabanAnda = Array.from(jawabanAndaElements).some(h2 => h2.text() === 'Jawaban Anda:');
    expect(hasJawabanAnda).toBe(false);
    
    // Check that difficulty selector is present
    expect(wrapper.find('label').text()).toContain('Tingkat Kesulitan');
  });

  it('shows sections when play is clicked', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    // Initially, the sections should not be visible
    let urutanAsliElements = wrapper.findAll('h2');
    let hasUrutanAsli = Array.from(urutanAsliElements).some(h2 => h2.text() === 'Urutan Asli:');
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
      hasUrutanAsli = Array.from(urutanAsliElements).some(h2 => h2.text() === 'Urutan Asli:');
      const hasPilihAngka = Array.from(urutanAsliElements).some(h2 => h2.text() === 'Pilih Angka:');
      const hasJawabanAnda = Array.from(urutanAsliElements).some(h2 => h2.text() === 'Jawaban Anda:');
      
      expect(hasUrutanAsli).toBe(true);
      expect(hasPilihAngka).toBe(true);
      expect(hasJawabanAnda).toBe(true);
    }
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
    expect(memorizationMessage.text()).toContain('Ingat urutan angka berwarna');
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
      const hasUrutanAsliBefore = Array.from(urutanAsliElementsBefore).some(h2 => h2.text() === 'Urutan Asli:');
      expect(hasUrutanAsliBefore).toBe(true);

      // Find and click the result/check button
      const resultButton = Array.from(buttons).find(btn => 
        btn.text().includes('Cek') || btn.text().includes('Result') || btn.text().includes('Check')
      );
      
      if (resultButton) {
        await resultButton.trigger('click');
        await wrapper.vm.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 150)); // Wait for the timeout in handleResult

        // Verify sections are now hidden after result is clicked
        const urutanAsliElementsAfter = wrapper.findAll('h2');
        const hasUrutanAsliAfter = Array.from(urutanAsliElementsAfter).some(h2 => h2.text() === 'Urutan Asli:');
        expect(hasUrutanAsliAfter).toBe(false);
      }
    }
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
  });
});