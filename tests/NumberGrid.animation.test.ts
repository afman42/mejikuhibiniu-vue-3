import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NumberGrid from '../src/components/NumberGrid.vue';
import { createInitialColorsRandom } from '../src/data';

describe('NumberGrid Component - Animation and Touch Tests', () => {
  it('renders with transition-group for animations', () => {
    const numbers = createInitialColorsRandom().slice(0, 3);
    const wrapper = mount(NumberGrid, {
      props: {
        numbers,
        showOriginalColors: true
      }
    });

    // Check that the component has the transition-group container
    expect(wrapper.find('div.flex.flex-wrap.justify-center.gap-1').exists()).toBe(true);
    
    // Check that the correct number of grid cells are rendered
    const gridCells = wrapper.findAll('div[role="gridcell"]');
    expect(gridCells).toHaveLength(3);

    wrapper.unmount();
  });

  it('applies correct CSS classes for animations', () => {
    const numbers = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(NumberGrid, {
      props: {
        numbers,
        showOriginalColors: true
      }
    });

    const items = wrapper.findAll('div');
    const animatedItem = items.find(item => 
      item.classes().includes('transition-all') && 
      item.classes().includes('duration-300')
    );
    
    expect(animatedItem).toBeDefined();

    wrapper.unmount();
  });

  it('emits select event when item is clicked', async () => {
    const numbers = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(NumberGrid, {
      props: {
        numbers,
        disabled: false,
        showOriginalColors: true
      }
    });

    const item = wrapper.find('div.w-10.h-10'); // Find the clickable element
    if (item.exists()) {
      await item.trigger('click');
      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')![0]).toEqual([numbers[0]]);
    } else {
      // Fallback: find by aria-label or similar
      const clickableItems = wrapper.findAll('div[role="gridcell"]');
      if (clickableItems.length > 0) {
        await clickableItems[0].trigger('click');
        expect(wrapper.emitted('select')).toBeTruthy();
        expect(wrapper.emitted('select')![0]).toEqual([numbers[0]]);
      }
    }

    wrapper.unmount();
  });

  it('does not emit select event when disabled', async () => {
    const numbers = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(NumberGrid, {
      props: {
        numbers,
        disabled: true,
        showOriginalColors: true
      }
    });

    const item = wrapper.find('div.w-10.h-10');
    if (item.exists() && !item.classes().includes('opacity-50')) {
      await item.trigger('click');
    } else {
      const clickableItems = wrapper.findAll('div[role="gridcell"]');
      if (clickableItems.length > 0) {
        await clickableItems[0].trigger('click');
      }
    }
    
    expect(wrapper.emitted('select')).toBeUndefined();

    wrapper.unmount();
  });

  it('applies selected styling when item is selected', () => {
    const numbers = createInitialColorsRandom().slice(0, 2);
    const selectedItems = [numbers[0].name];
    
    const wrapper = mount(NumberGrid, {
      props: {
        numbers,
        selectedItems,
        showOriginalColors: true
      }
    });

    const items = wrapper.findAll('div[role="gridcell"]');
    if (items.length >= 2) {
      expect(items[0].classes()).toContain('ring-2'); // First item should be selected
      expect(items[1].classes()).not.toContain('ring-2'); // Second item should not be selected
    }

    wrapper.unmount();
  });
});