<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'

import { ref } from 'vue'

const url = ref('')
const selector = ref('')
const preview = () => {
  console.log('preview', url.value, selector.value)
}

</script>

<template>
  <h1>watch-a-div</h1>

  <div class="form">

    <fieldset>
      <label for="url">URL:</label>
      <input name="url" type="text" v-model="url" />
    </fieldset>

    <fieldset>
      <label for="selector">Selector:</label>
      <input type="text" name="selector" v-model="selector" />
    </fieldset>

    <button @click="preview">Preview</button>

  </div>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
