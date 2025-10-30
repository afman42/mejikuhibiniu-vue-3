import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SequenceDisplay from '../src/components/SequenceDisplay.vue';
import { createInitialColorsRandom } from '../src/data';

describe('SequenceDisplay Component - Animation Tests', () => {
  it('renders with div container for transition-group functionality', () => {
    const sequence = createInitialColorsRandom().slice(0, 3); // Use first 3 items
    const wrapper = mount(SequenceDisplay, {
      props: {
        sequence,
        showOriginalColors: true
      }
    });

    // Check that there's a container div for the transition-group functionality
    expect(wrapper.find('div.flex.flex-row.flex-wrap').exists()).toBe(true);
    
    // Check that the correct number of items are rendered
    expect(wrapper.findAll('[data-testid^="sequence-item-"]')).toHaveLength(3);

    wrapper.unmount();
  });

  it('applies correct CSS classes for animations', () => {
    const sequence = createInitialColorsRandom().slice(0, 2);
    const wrapper = mount(SequenceDisplay, {
      props: {
        sequence,
        showOriginalColors: true
      }
    });

    const items = wrapper.findAll('div');
    const animatedItems = items.filter(item => 
      item.classes().includes('transition-all') && 
      item.classes().includes('duration-300')
    );
    
    expect(animatedItems.length).toBeGreaterThan(0);

    wrapper.unmount();
  });

  it('renders items with correct color classes', () => {
    const sequence = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(SequenceDisplay, {
      props: {
        sequence,
        showOriginalColors: true
      }
    });

    const item = wrapper.find('[data-testid^="sequence-item-"]');
    expect(item.exists()).toBe(true);
    
    // Check that color class is applied when showOriginalColors is true
    expect(item.classes()).toContain('bg-red'); // First color in sequence

    wrapper.unmount();
  });

  it('renders items with gray background when showOriginalColors is false', () => {
    const sequence = createInitialColorsRandom().slice(0, 1);
    const wrapper = mount(SequenceDisplay, {
      props: {
        sequence,
        showOriginalColors: false
      }
    });

    const item = wrapper.find('[data-testid^="sequence-item-"]');
    expect(item.exists()).toBe(true);
    
    // Check that gray background is applied when showOriginalColors is false
    expect(item.classes()).toContain('bg-gray-400');

    wrapper.unmount();
  });
});