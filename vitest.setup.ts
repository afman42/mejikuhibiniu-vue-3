import { config } from '@vue/test-utils';

// Mock the window.setInterval function
const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

Object.defineProperty(window, 'setInterval', {
  value: vi.fn(originalSetInterval),
});

Object.defineProperty(window, 'clearInterval', {
  value: vi.fn(originalClearInterval),
});

// Configure Vue Test Utils
config.global.mocks = {
  $t: (msg: string) => msg, // Mock Vue i18n if needed
};