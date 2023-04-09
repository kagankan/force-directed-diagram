<script setup lang="ts">
import { defineEmits, ref } from "vue";

const options = [
    {
        label: "へるぷ",
        value: "help-jp",
    },
    {
        label: "comic-forum",
        value: "comic-forum",
    },
    {
        label: "icons",
        value: "icons",
    },
] as const

const project = ref<(typeof options)[number]["value"]>("help-jp");
const emit = defineEmits(["projectChanged"]); // emit 作成
const onChange = () => {
  emit("projectChanged", project.value); // emit 実行
};
</script>

<template>
  <header>
    <h2>Scrapbox graph</h2>
    <select v-model="project" @change="onChange">
      <option v-for="option in options" :value="option.value">{{ option.label }}</option>
    </select>
  </header>
</template>



<style scoped>
header {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 50px;
}

h2 {
  margin: 0;
  margin-left: 1em;
  text-align: left;
}

select {
  position: fixed;
  top: 0px;
  right: 0px;
  margin: 1em;
}
</style>
