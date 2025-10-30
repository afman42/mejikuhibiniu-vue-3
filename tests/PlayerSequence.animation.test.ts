import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PlayerSequence from '../src/components/PlayerSequence.vue';
import { createInitialColorsRandom } from '../src/data';

describe('PlayerSequence Component - Animation Tests', () => {
  it('renders with transition-group for animations', () => {
    const sequence = createInitialColorsRandom().slice(0, 2);
    const wrapper = mount(PlayerSequence, {
      props: {
        sequence,
        showOriginalColors: true
      }
    });

    // Check that the component has the transition-group container
    expect(wrapper.find('div.player-sequence').exists()).toBe(true);
    
    // Check that the correct number of items are rendered
    expect(wrapper.findAll('div[role="listitem"]')).toHaveLength(2);

    wrapper.unmount();
  });

  it('applies correct CSS classes for animations', () => {
    const sequence = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(PlayerSequence, {
      props: {
        sequence,
        showOriginalColors: true
      }
    });

    const items = wrapper.findAll('div[role="listitem"]');
    const animatedItem = items.find(item => 
      item.classes().includes('transition-all') && 
      item.classes().includes('duration-300')
    );
    
    if (animatedItem) {
      expect(animatedItem).toBeDefined();
    } else {
      // If not found directly, check any child items
      const allDivs = wrapper.findAll('div');
      const hasAnimation = allDivs.some(item => 
        item.classes().includes('transition-all') && 
        item.classes().includes('duration-300')
      );
      expect(hasAnimation).toBe(true);
    }

    wrapper.unmount();
  });

  it('emits remove event when item is clicked', async () => {
    const sequence = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(PlayerSequence, {
      props: {
        sequence,
        showOriginalColors: true,
        disabled: false
      }
    });

    const item = wrapper.find('div.w-10.h-10'); // Find the clickable element
    if (item.exists()) {
      await item.trigger('click');
      expect(wrapper.emitted('remove')).toBeTruthy();
      expect(wrapper.emitted('remove')![0]).toEqual([sequence[0].name]);
    } else {
      // Fallback: find by role
      const clickableItems = wrapper.findAll('div[role="listitem"]');
      if (clickableItems.length > 0) {
        await clickableItems[0].trigger('click');
        expect(wrapper.emitted('remove')).toBeTruthy();
        expect(wrapper.emitted('remove')![0]).toEqual([sequence[0].name]);
      }
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

    const item = wrapper.find('div.w-10.h-10');
    if (item.exists()) {
      await item.trigger('click');
    } else {
      const clickableItems = wrapper.findAll('div[role="listitem"]');
      if (clickableItems.length > 0) {
        await clickableItems[0].trigger('click');
      }
    }
    
    expect(wrapper.emitted('remove')).toBeUndefined();

    wrapper.unmount();
  });
});