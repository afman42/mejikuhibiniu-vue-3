import { config } from '@vue/test-utils';
import Vue3TouchEvents from 'vue3-touch-events';

// Mock the window.setInterval function
const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

Object.defineProperty(window, 'setInterval', {
  value: vi.fn(originalSetInterval),
});

Object.defineProperty(window, 'clearInterval', {
  value: vi.fn(originalClearInterval),
});

// Configure Vue Test Utils with the touch events plugin
config.global.plugins = [Vue3TouchEvents];

config.global.mocks = {
  $t: (msg: string) => msg, // Mock Vue i18n if needed
};