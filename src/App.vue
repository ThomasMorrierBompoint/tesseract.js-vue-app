<template>
  <div id="app">
    <div class="header">
      <button v-on:click="recognize">Start OCR</button>
      <select @change="update" name="src">
        <option value="/images/testocr.png">testocr.png</option>
        <option value="/images/cv.png">cv.png</option>
        <option value="/images/facture.png">facture.png</option>
        <option value="/images/facture-table.png">facture-table.png</option>
        <option value="/images/facture-videotron.png">facture-videotron.png</option>
        <option value="/images/text-russe.jpg">text-russe.jpg</option>
      </select>
      <select @change="updateLocale" name="locale">
        <option value="eng">Anglais</option>
        <option value="fra">Francais</option>
        <option value="rus">Russe</option>
      </select>
    </div>
    <img v-if="image" id="text-img" :src="image">
    <template v-if="text">
      <div class="result">
        <h3>Result</h3>
        <div>{{ text }}</div>
      </div>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
import { createWorker, PSM, OEM } from 'tesseract.js';
const worker = createWorker({
  logger: m => console.log(m),
});

export default {
  name: 'app',
  data() {
    return {
      text:'',
      locale:'eng',
      image: location.origin + '/images/testocr.png',
    };
  },
  methods: {
    update(event) {
      this.image = location.origin + event.target.value;
    },
    updateLocale(event) {
      this.locale = event.target.value;
    },
    async recognize() {
      const img = document.getElementById('text-img');
      console.log(img);
      await worker.load();
      await worker.loadLanguage(this.locale);
      await worker.initialize(this.locale, OEM.LSTM_ONLY);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      const { data: { text } } = await worker.recognize(img);
      this.text = text;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.header {
  position: absolute;
  top: 15px;
  left: 15px;
}
.header button, .header select {
  padding: 10px;
  margin: 10px;
}
#app img {
  margin: 50px auto auto;
  max-height: 90%;
  max-width: 90%;
  border: solid 2px black;
}
.result {
  margin: auto;
  max-height: 50%;
  max-width: 50%;
}
</style>
