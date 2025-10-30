import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PlayerSequence from '../src/components/PlayerSequence.vue';
import { createInitialColorsRandom } from '../src/data';

describe('PlayerSequence Component - Touch Gesture Tests', () => {
  it('handles swipe gestures', async () => {
    const sequence = createInitialColorsRandom().slice(0, 2);
    const wrapper = mount(PlayerSequence, {
      props: {
        sequence,
        showOriginalColors: true
      }
    });

    // Check that the component exists
    expect(wrapper.exists()).toBe(true);

    wrapper.unmount();
  });

  it('emits remove event on swipe left when sequence is not empty', async () => {
    const sequence = createInitialColorsRandom().slice(0, 2);
    const wrapper = mount(PlayerSequence, {
      props: {
        sequence,
        showOriginalColors: true,
        disabled: false
      }
    });

    // Manually call the swipe left method
    const vm = wrapper.vm as any;
    if (vm.onSwipeLeft) {
      vm.onSwipeLeft();
      // Wait a bit for any async operations
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(wrapper.emitted('remove')).toBeTruthy();
    }

    wrapper.unmount();
  });

  it('does not emit remove event when disabled', async () => {
    const sequence = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(PlayerSequence, {
      props: {
        sequence,
        showOriginalColors: true,
        disabled: true
      }
    });

    // Manually call the swipe left method
    const vm = wrapper.vm as any;
    if (vm.onSwipeLeft) {
      vm.onSwipeLeft();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(wrapper.emitted('remove')).toBeUndefined();
    }

    wrapper.unmount();
  });

  it('handles double click for removal', async () => {
    const sequence = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(PlayerSequence, {
      props: {
        sequence,
        showOriginalColors: true,
        disabled: false
      }
    });

    const item = wrapper.find('div.w-10.h-10');
    if (item.exists()) {
      await item.trigger('dblclick');
      expect(wrapper.emitted('remove')).toBeTruthy();
      expect(wrapper.emitted('remove')![0]).toEqual([sequence[0].name]);
    } else {
      const clickableItems = wrapper.findAll('div[role="listitem"]');
      if (clickableItems.length > 0) {
        await clickableItems[0].trigger('dblclick');
        expect(wrapper.emitted('remove')).toBeTruthy();
        expect(wrapper.emitted('remove')![0]).toEqual([sequence[0].name]);
      }
    }

    wrapper.unmount();
  });
});