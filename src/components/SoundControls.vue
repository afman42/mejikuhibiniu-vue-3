<template>
  <div class="sound-controls flex items-center gap-2">
    <button
      @click="toggleSound"
      :aria-label="
        soundService.getEnabled() ? 'Matikan suara' : 'Nyalakan suara'
      "
      class="p-2 rounded-full hover:bg-cyan-100 transition-colors flex items-center justify-center"
      :class="{
        'text-cyan-600': soundService.getEnabled(),
        'text-gray-400': !soundService.getEnabled(),
      }"
    >
      <Icon
        :icon="
          soundService.getEnabled() ? 'mdi:volume-high' : 'mdi:volume-mute'
        "
        class="w-6 h-6"
      />
    </button>

    <input
      v-if="soundService.getEnabled()"
      type="range"
      min="0"
      max="1"
      step="0.1"
      :value="soundService.getVolume()"
      @input="setVolume"
      class="w-20 accent-cyan-500"
      aria-label="Atur volume suara"
    />
  </div>
</template>

<script setup lang="ts">
import { soundService } from "../services/soundService";
import { Icon } from "@iconify/vue";

const toggleSound = () => {
  soundService.setEnabled(!soundService.getEnabled());
  window.location.reload();
};

const setVolume = (event: Event) => {
  const target = event.target as HTMLInputElement;
  soundService.setVolume(parseFloat(target.value));
};
</script>
