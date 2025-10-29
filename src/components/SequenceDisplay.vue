<template>
  <div class="sequence-display flex flex-row flex-wrap justify-center gap-1 sm:gap-2 mb-4" data-testid="sequence-display" role="list" aria-label="Urutan angka asli">
    <div
      v-for="item in sequence"
      :key="item.name"
      :class="[
        'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white font-bold text-xs sm:text-sm',
        showOriginalColors ? getColorClass(item.color) : 'bg-gray-400'
      ]"
      :data-testid="'sequence-item-' + item.name"
      role="listitem"
      :aria-label="`Angka ${item.nbr} berwarna ${showOriginalColors ? getColorName(item.color) : 'abu-abu'}`"
    >
      {{ item.nbr }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { IColorRandom } from '../data';

interface Props {
  sequence: IColorRandom[];
  showOriginalColors?: boolean;
}

withDefaults(defineProps<Props>(), {
  showOriginalColors: true
});

const getColorClass = (color: string) => {
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
</script>