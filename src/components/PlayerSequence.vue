<template>
  <div class="player-sequence flex flex-wrap justify-center gap-1 sm:gap-2 mb-4" role="list" aria-label="Urutan angka yang Anda pilih">
    <div
      v-for="item in sequence"
      :key="item.name"
      :class="[
        'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white font-bold cursor-pointer transition-all duration-200 transform text-sm sm:text-base',
        showOriginalColors ? getOriginalColorClass(item.color) : 'bg-gray-400',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95',
        'ring-1 ring-gray-300' // Add a subtle ring for better visibility
      ]"
      @click="!disabled && onRemove(item.name)"
      :aria-label="`Angka ${item.nbr}, klik untuk menghapus`"
      role="listitem"
      tabindex="0"
      @keydown.enter="!disabled && onRemove(item.name)"
      @keydown.space="!disabled && onRemove(item.name)"
    >
      <span class="font-bold">{{ item.nbr }}</span>
    </div>
    <div v-if="sequence.length === 0" class="text-gray-500 italic text-xs sm:text-sm flex items-center justify-center w-full" role="status" aria-live="polite">
      Jawaban Anda akan muncul di sini
    </div>
  </div>
</template>

<script setup lang="ts">
import { IColorRandom } from '../data';

interface Props {
  sequence: IColorRandom[];
  disabled?: boolean;
  showOriginalColors?: boolean; // Whether to show original colors or plain background
}

interface Emits {
  (e: 'remove', name: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  showOriginalColors: false
});
const emit = defineEmits<Emits>();

const onRemove = (name: string) => {
  emit('remove', name);
};

const getOriginalColorClass = (color: string) => {
  // Convert the text-* class to bg-* class for the display
  return color.replace('text-', 'bg-');
};
</script>