<template>
  <div 
    class="number-grid flex flex-wrap justify-center gap-1 sm:gap-2 mb-4" 
    role="grid" 
    aria-label="Pilihan angka berwarna"
    v-touch:swipe.left="onSwipeLeft"
    v-touch:swipe.right="onSwipeRight"
    v-touch:swipe.up="onSwipeUp"
    v-touch:swipe.down="onSwipeDown"
  >
    <transition-group 
      name="flip-list"
      tag="div" 
      class="flex flex-wrap justify-center gap-1 sm:gap-2"
    >
      <div
        v-for="item in numbers"
        :key="item.name"
        :class="[
          'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white font-bold cursor-pointer transition-all duration-300 transform text-sm sm:text-base',
          showOriginalColors && !isSelected(item.name) ? getColorClass(item.color) : 'bg-gray-400',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95',
          isSelected(item.name) ? `ring-2 ring-cyan-500 ${showOriginalColors ? getOriginalColorClass(item.color) : 'bg-gray-500'}` : ''
        ]"
        @click="!disabled && onClick(item)"
        :aria-pressed="isSelected(item.name)"
        :aria-label="`Angka ${item.nbr} berwarna ${getColorName(item.color)}`"
        role="gridcell"
        tabindex="0"
        @keydown.enter="!disabled && onClick(item)"
        @keydown.space="!disabled && onClick(item)"
        v-memo="[item.name, item.nbr, item.color, isSelected(item.name), showOriginalColors, disabled]"
      >
        <span class="font-bold">{{ item.nbr }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { IColorRandom } from '../data';

interface Props {
  numbers: IColorRandom[];
  disabled?: boolean;
  selectedItems?: string[]; // List of names of selected items
  showOriginalColors?: boolean; // Whether to show original colors or plain background
}

interface Emits {
  (e: 'select', item: IColorRandom): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedItems: () => [],
  showOriginalColors: false
});
const emit = defineEmits<Emits>();

const onClick = (item: IColorRandom) => {
  emit('select', item);
};

const isSelected = (name: string) => {
  return props.selectedItems.includes(name);
};

const getColorClass = (color: string) => {
  // Convert the text-* class to bg-* class for the display
  return color.replace('text-', 'bg-');
};

const getOriginalColorClass = (color: string) => {
  // Convert the text-* class to bg-* class for the display
  return color.replace('text-', 'bg-');
};

// Map color classes to actual color names for accessibility
const getColorName = (colorClass: string) => {
  const colorMap: Record<string, string> = {
    'bg-red': 'merah',
    'bg-orange': 'jingga',
    'bg-yellow': 'kuning',
    'bg-green': 'hijau',
    'bg-blue': 'biru',
    'bg-nila': 'nila',
    'bg-purple': 'ungu'
  };
  
  const bgClass = getColorClass(colorClass);
  return colorMap[bgClass] || 'tidak dikenal';
};

// Touch swipe handlers for mobile
const onSwipeLeft = () => {
  // Could implement swipe to navigate or suggest next action
  console.log('Swiped left - could navigate to previous hint');
};

const onSwipeRight = () => {
  // Could implement swipe to navigate or suggest next action
  console.log('Swiped right - could navigate to next hint');
};

const onSwipeUp = () => {
  // Could implement swipe to reveal hints or additional info
  console.log('Swiped up - could show hint or additional information');
};

const onSwipeDown = () => {
  // Could implement swipe to hide info or reset
  console.log('Swiped down - could hide info or reset');
};
</script>