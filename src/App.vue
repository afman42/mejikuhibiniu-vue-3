<script setup lang="ts">
import { colorsRandom, IColorRandom } from "./data";
import { ref, computed } from "vue";
const showNumberRandom = ref<IColorRandom[]>(colorsRandom);
const showResult = ref<{ result: string; bool: boolean }>({
  result: "",
  bool: false,
});
const isActive = ref<boolean>(true);
const toggleStart = ref<boolean>(false);
const timerSecond = ref<number>(10);
const addArrayNumber = ref<IColorRandom[]>([]);

function play() {
  let id = setInterval(frame, 1000);
  function frame() {
    if (timerSecond.value <= 0) {
      timerSecond.value = 0;
      clearInterval(id);
      isActive.value = true;
    } else {
      timerSecond.value--;
      isActive.value = false;
    }
  }
  toggleStart.value = true;
}
function shuffleArray() {
  showNumberRandom.value = showNumberRandom.value
    .map((item: IColorRandom) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }: { item: IColorRandom }) => item);
}
function reset() {
  timerSecond.value = 10;
  toggleStart.value = false;
  addArrayNumber.value = [];
  isActive.value = true;
  showResult.value.bool = false;
  shuffleArray();
}
function result() {
  if (JSON.stringify(addArrayNumber.value) === JSON.stringify(colorsRandom)) {
    showResult.value.result = "Menang";
  } else {
    showResult.value.result = "Kalah";
  }
  showResult.value.bool = true;
  isActive.value = false;
}
function clickDiv(numberRandom: IColorRandom) {
  if (toggleStart.value) {
    if (timerSecond.value === 0) {
      let check = addArrayNumber.value
        .map((item: IColorRandom) => item.name)
        .includes(numberRandom.name);
      if (addArrayNumber.value.length <= showNumberRandom.value.length) {
        if (check) {
          return;
        }
        addArrayNumber.value.push({
          color: numberRandom.color,
          name: numberRandom.name,
          nbr: numberRandom.nbr,
        });
      }
    }
  }
}
function removeObjectInArray(name: string) {
  if (showResult.value.bool) {
    return;
  }
  addArrayNumber.value = addArrayNumber.value.filter(
    (item: IColorRandom) => item.name !== name
  );
}
shuffleArray();
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <h2>
      <span
        v-for="itemColor in colorsRandom"
        :class="itemColor.color"
        :key="itemColor.color"
        >{{ itemColor.name }}</span
      >
    </h2>
    <span class="mb-2"
      >Urutkan angka warna
      <span
        v-for="itemColor in colorsRandom"
        :class="itemColor.color"
        :key="itemColor.color"
        >{{ itemColor.name }}</span
      >
      dengan klik angkanya</span
    >
    <span v-if="showResult.bool" class="mb-2">{{ showResult.result }}</span>
    <div class="flex flex-row mb-2">
      <div
        class="mr-2 cursor-pointer"
        :class="[isActive ? 'text-black' : item.color]"
        :key="item.color"
        v-for="item in showNumberRandom"
        @click="clickDiv(item)"
      >
        {{ item.nbr }}
      </div>
    </div>
    <p class="mb-2" v-if="addArrayNumber.length">Jawaban Anda</p>
    <div class="flex flex-row mb-2" v-if="addArrayNumber.length">
      <div
        class="mr-2 cursor-pointer"
        :class="[isActive ? 'text-black' : item.color]"
        :key="item.color"
        v-for="item in addArrayNumber"
        @click="removeObjectInArray(item.name)"
      >
        {{ item.nbr }}
      </div>
    </div>
    <transition name="no-item-opacity">
      <div v-if="showResult.bool">
        <p style="text-align: center">Samakan</p>
        <div class="flex flex-row mb-2">
          <div
            class="mr-2 cursor-pointer"
            :class="item.color"
            :key="item.color"
            v-for="item in colorsRandom"
            @click="removeObjectInArray(item.name)"
          >
            {{ item.nbr }}
          </div>
        </div>
      </div>
    </transition>
    <div class="flex flex-row">
      <div class="mr-2">
        Waktu: {{ timerSecond == 0 ? timerSecond : timerSecond + "s" }}
      </div>
      <div>
        <button @click="play" class="mr-2" :disabled="toggleStart">Play</button>
        <button @click="reset" class="mr-2" :disabled="toggleStart === false">
          Reset
        </button>
        <button
          @click="result"
          v-if="addArrayNumber.length === showNumberRandom.length"
        >
          Result
        </button>
      </div>
    </div>
  </div>
</template>
