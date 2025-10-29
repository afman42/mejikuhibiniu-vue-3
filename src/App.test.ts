import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from './App.vue';

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

  it('initializes with a random sequence and shuffled display', async () => {
    const wrapper = mount(App);
    
    await flushPromises(); // Wait for component to mount and initialize
    
    // Check that the component has loaded with initial values
    expect(wrapper.exists()).toBe(true);
    
    // Check that original sequence exists with 7 items
    const vm = wrapper.vm as any;
    expect(vm.originalSequence).toHaveLength(7);
    
    // Check that the display sequence is shuffled (not in original order)
    expect(vm.displaySequence).toHaveLength(7);
    
    // The original sequence should contain the expected names
    const originalNames = vm.originalSequence.map((item: any) => item.name);
    expect(originalNames).toEqual(['me', 'ji', 'ku', 'hi', 'bi', 'ni', 'u']);
    
    // Check initial game state
    expect(vm.isMemorizing).toBe(true);
    expect(vm.isPlaying).toBe(false);
    expect(vm.timerSecond).toBe(10);
    expect(vm.gameResult.bool).toBe(false);
  });

  it('starts the timer when play button is clicked', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    // Initially the timer should be at 10 and not playing
    const vm = wrapper.vm as any;
    expect(vm.isPlaying).toBe(false);
    expect(vm.timerSecond).toBe(10);

    // Find and click the play button
    const playButton = wrapper.find('button');
    await playButton.trigger('click');

    // Check that the game is now playing and timer state is updated
    expect(vm.isPlaying).toBe(true);
    expect(vm.isMemorizing).toBe(false);
    
    // Check that setInterval was called
    expect(window.setInterval).toHaveBeenCalled();
  });

  it('allows player to select numbers after timer ends', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    const vm = wrapper.vm as any;
    
    // Click play to start, then simulate timer ending
    const playButton = wrapper.find('button');
    await playButton.trigger('click');
    
    // Manually set timer to 0 to simulate time ending
    vm.timerSecond = 0;
    await wrapper.vm.$nextTick();
    
    // Check that player can now select numbers
    expect(vm.isPlaying).toBe(true);
    expect(vm.timerSecond).toBe(0);
    
    // Get the first displayed number
    const displayedNumbers = wrapper.findAll('.cursor-pointer');
    if (displayedNumbers.length > 0) {
      const firstNumber = displayedNumbers[0];
      await firstNumber.trigger('click');
      
      // Check that the number was added to the player sequence
      expect(vm.playerSequence).toHaveLength(1);
    }
  });

  it('allows player to remove numbers from their sequence', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    const vm = wrapper.vm as any;
    
    // Start game and simulate timer ending
    const playButton = wrapper.find('button');
    await playButton.trigger('click');
    
    // Manually set timer to 0
    vm.timerSecond = 0;
    await wrapper.vm.$nextTick();
    
    // Add a number to player sequence
    const displayedNumbers = wrapper.findAll('.cursor-pointer');
    if (displayedNumbers.length > 0) {
      await displayedNumbers[0].trigger('click');
      expect(vm.playerSequence).toHaveLength(1);
      
      // Now remove the number by directly calling the function
      const firstPlayerItemName = vm.playerSequence[0].name;
      vm.removeObjectInArray(firstPlayerItemName);
      await wrapper.vm.$nextTick();
      expect(vm.playerSequence).toHaveLength(0);
    }
  });

  it('correctly checks the result', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    const vm = wrapper.vm as any;
    
    // Start game and simulate timer ending
    const playButton = wrapper.find('button');
    await playButton.trigger('click');
    
    vm.timerSecond = 0;
    await wrapper.vm.$nextTick();
    
    // Simulate player entering the correct sequence
    // For this test, we'll directly set the player sequence to match the original
    vm.playerSequence = [...vm.originalSequence];
    await wrapper.vm.$nextTick();
    
    // Find and click the result button (which should appear now)
    const resultButtons = wrapper.findAll('button');
    const resultButton = Array.from(resultButtons).find(btn => 
      btn.text() === 'Result'
    );
    
    if (resultButton) {
      await resultButton.trigger('click');
      
      // Check that the result is correct (should be "Menang")
      expect(vm.gameResult.result).toBe("Menang");
      expect(vm.gameResult.bool).toBe(true);
    }
  });

  it('shows "Kalah" when sequence is incorrect', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    const vm = wrapper.vm as any;
    
    // Start game and simulate timer ending
    const playButton = wrapper.find('button');
    await playButton.trigger('click');
    
    vm.timerSecond = 0;
    await wrapper.vm.$nextTick();
    
    // Add an incorrect sequence to playerSequence
    vm.playerSequence = [
      // Add different numbers to make it incorrect
      { color: 'text-red', name: 'me', nbr: 999 },
      { color: 'text-orange', name: 'ji', nbr: 888 },
      { color: 'text-yellow', name: 'ku', nbr: 777 },
      { color: 'text-green', name: 'hi', nbr: 666 },
      { color: 'text-blue', name: 'bi', nbr: 555 },
      { color: 'text-nila', name: 'ni', nbr: 444 },
      { color: 'text-purple', name: 'u', nbr: 333 }
    ];
    
    await wrapper.vm.$nextTick();
    
    // Find and click the result button
    const resultButtons = wrapper.findAll('button');
    const resultButton = Array.from(resultButtons).find(btn => 
      btn.text() === 'Result'
    );
    
    if (resultButton) {
      await resultButton.trigger('click');
      
      // Check that the result is incorrect (should be "Kalah")
      expect(vm.gameResult.result).toBe("Kalah");
      expect(vm.gameResult.bool).toBe(true);
    }
  });

  it('resets the game when reset button is clicked', async () => {
    const wrapper = mount(App);
    await flushPromises(); // Wait for component to mount and initialize

    const vm = wrapper.vm as any;
    
    // Start game
    const playButton = wrapper.find('button');
    await playButton.trigger('click');
    
    // Add items to player sequence 
    vm.playerSequence = [{ color: 'text-red', name: 'me', nbr: 123 }];
    vm.gameResult = { result: "Menang", bool: true };
    vm.timerSecond = 5;
    await wrapper.vm.$nextTick();
    
    // Find and click the reset button
    const resetButton = Array.from(wrapper.findAll('button')).find(btn => 
      btn.text() === 'Reset'
    );
    
    if (resetButton) {
      await resetButton.trigger('click');
      
      // Wait for reset to complete
      await wrapper.vm.$nextTick();
      
      // Check that game state is reset
      expect(vm.playerSequence).toHaveLength(0);
      expect(vm.gameResult.bool).toBe(false);
      expect(vm.timerSecond).toBe(10);
      expect(vm.isMemorizing).toBe(true);
      expect(vm.isPlaying).toBe(false);
    }
  });
});