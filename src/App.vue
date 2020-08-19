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
        <option value="/images/text-manuscript.jpg">text-manuscript.jpg</option>
        <option value="/images/text-caligraphie.jpg">text-caligraphie.jpg</option>
      </select>
      <select @change="updateLocale" name="locale">
        <option value="eng">Anglais</option>
        <option value="fra">Francais</option>
        <option value="rus">Russe</option>
      </select>
    </div>
    <img v-if="image" id="text-img" :src="image">
    <k-progress :percent="Math.floor(progress * 100)" />
    <template v-if="text">
      <div class="result">
        <h3>Result: {{ this.image.split('/').slice(-1)[0] }}</h3>
        <div>{{ text }}</div>
      </div>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
import { createWorker, PSM, OEM } from 'tesseract.js';

export default {
  name: 'app',
  data() {
    return {
      worker: {},
      locale:'eng',
      image: location.href + '/images/testocr.png',
      text:'',
      results: {},
      progress: 0,
    };
  },
  mounted() {
    let self = this;
    this.worker = createWorker({
      logger: m => {
        console.log(m);
        if (m.status === 'recognizing text') {
          self.progress = m.progress;
        }
      },
    });
  },
  methods: {
    update(event) {
      this.image = location.href + event.target.value;

      const key  = this.image;
      this.text = this.results[key];
    },
    updateLocale(event) {
      this.locale = event.target.value;
    },
    async recognize() {
      const img = document.getElementById('text-img');

      await this.worker.load();
      await this.worker.loadLanguage(this.locale);
      await this.worker.initialize(this.locale, OEM.LSTM_ONLY);
      await this.worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });

      const { data: { text } } = await this.worker.recognize(img);
      this.text = text;
      this.results[this.image] = text;
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
  max-height: 60vh;
  border: solid 2px black;
}
.result {
  margin: auto;
  max-height: 50vh;
  max-width: 75%;
}
</style>
