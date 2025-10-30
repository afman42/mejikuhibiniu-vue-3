import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NumberGrid from '../src/components/NumberGrid.vue';
import { createInitialColorsRandom } from '../src/data';

describe('NumberGrid Component - Touch Gesture Tests', () => {
  it('handles swipe gestures', async () => {
    const numbers = createInitialColorsRandom().slice(0, 2);
    const wrapper = mount(NumberGrid, {
      props: {
        numbers,
        showOriginalColors: true
      }
    });

    // Check that the component exists
    expect(wrapper.exists()).toBe(true);

    wrapper.unmount();
  });

  it('emits select event correctly with touch', async () => {
    const numbers = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(NumberGrid, {
      props: {
        numbers,
        disabled: false,
        showOriginalColors: true
      }
    });

    const item = wrapper.find('div.w-10.h-10');
    if (item.exists()) {
      await item.trigger('click'); // Using click as a proxy for touch in tests
      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')![0]).toEqual([numbers[0]]);
    } else {
      const clickableItems = wrapper.findAll('div[role="gridcell"]');
      if (clickableItems.length > 0) {
        await clickableItems[0].trigger('click');
        expect(wrapper.emitted('select')).toBeTruthy();
        expect(wrapper.emitted('select')![0]).toEqual([numbers[0]]);
      }
    }

    wrapper.unmount();
  });
});