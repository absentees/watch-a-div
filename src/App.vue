<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'

import { ref } from 'vue'

const url = ref('')
const selector = ref('')
const result = ref('')
const preview = () => {
  // Send the url to the netlify function getDiv
  // and get the html of the div
  // then display it in the preview

  fetch('/.netlify/functions/getDiv', {
    method: 'GET',
    body: JSON.stringify({
      name: "test"
    })})
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

    <div v-if="result">
      {{ result }}      
    </div>

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
