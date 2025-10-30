<template>
  <div 
    class="touch-interactive-container"
    v-touch:swipe.left="onSwipeLeft"
    v-touch:swipe.right="onSwipeRight"
    v-touch:swipe.up="onSwipeUp"
    v-touch:swipe.down="onSwipeDown"
    v-touch:pinch="onPinch"
    v-touch:rotate="onRotate"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'swipe-left'): void;
  (e: 'swipe-right'): void;
  (e: 'swipe-up'): void;
  (e: 'swipe-down'): void;
  (e: 'pinch', value: number): void;
  (e: 'rotate', value: number): void;
}

const emit = defineEmits<Emits>();

const onSwipeLeft = () => {
  emit('swipe-left');
};

const onSwipeRight = () => {
  emit('swipe-right');
};

const onSwipeUp = () => {
  emit('swipe-up');
};

const onSwipeDown = () => {
  emit('swipe-down');
};

const onPinch = (value: number) => {
  emit('pinch', value);
};

const onRotate = (value: number) => {
  emit('rotate', value);
};
</script>