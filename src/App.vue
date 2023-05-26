 
<script setup lang="ts">
import { ref } from 'vue'

// ref() creates a reactive variable
const url = ref('')
const selector = ref('')
const result = ref('')
const email = ref('')

// preview() is called when the user clicks the button
const preview = () => {
  // fetch() makes an HTTP request
  // fetch('/.netlify/functions/getDiv', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     url: url.value,
  //     selector: selector.value
  //   })
  // })
  //   // response.json() parses the JSON response
  //   .then(response => response.json())
  //   // data is the parsed response
  //   .then(data => {
  //     result.value = data
  //   })
  fetch('https://puppeteer-function.netlify.app/.netlify/functions/getDiv', {
    method: 'POST',
    body: JSON.stringify({
      url: 'https://apple.com',
      selector: 'h1'
    })
  })
    // response.json() parses the JSON response
    .then(response => response.json())
    // data is the parsed response
    .then(data => {
      result.value = data
    })
}

const sendEmail = () => {
  fetch('/.netlify/functions/newWatcher', {
    method: 'POST',
    body: JSON.stringify({
      url: url.value,
      selector: selector.value,
      email: email.value
    })
  })
    // response.json() parses the JSON response
    .then(response => response.json())
    // data is the parsed response
    .then(data => {
      result.value = data
    })
}
</script>

<template>
  <h1>watch-a-div</h1>

  <div class="form">


    <fieldset>
      <label for="email">Email:</label>
      <input name="email" type="email" v-model="email" />
    </fieldset>

    <fieldset>
      <label for="url">URL:</label>
      <input name="url" type="text" v-model="url" />
    </fieldset>

    <fieldset>
      <label for="selector">Selector:</label>
      <input type="text" name="selector" v-model="selector" />
    </fieldset>

    <button @click="preview">Preview</button>

    <button @click="sendEmail">Send email</button>

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
