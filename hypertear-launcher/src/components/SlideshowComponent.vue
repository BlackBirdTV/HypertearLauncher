<template>
  <div id="slideshow">
    <div v-for="url in urls" :key="(url as string)" class="slideshowItem">
      <img :src="(url as string)" alt="Failed to load" />
    </div>
    <button @click="nextSlide()" class="next">&#10095;</button>
    <button @click="prevSlide()" class="prev">&#10094;</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

let slides = document.getElementsByClassName("slideshowItem");

const slideshow = document.getElementById("slideshow");

let timeout: NodeJS.Timeout;

const component = defineComponent({
  mounted() {
    timeout = setTimeout(this.nextSlide, 4000);
  },
  props: {
    urls: {
      type: Array,
      required: false,
      default: () => {
        return [
          "http://github.com/BlackBirdTV/HypertearLauncher/raw/pages/Bot2.png",
          "http://github.com/BlackBirdTV/HypertearLauncher/raw/pages/Bot1.png",
        ];
      },
    },
  },
  methods: {
    setSlide(n: number) {
      if (timeout) clearTimeout(timeout);
      n = n > slides.length - 1 ? 0 : n;
      n = n < 0 ? slides.length - 1 : n;
      slides[this.slideshowIndex].setAttribute("style", "opacity:0");
      this.slideshowIndex = n;
      slides[this.slideshowIndex].setAttribute("style", "opacity:1");
      timeout = setTimeout(this.nextSlide, 4000);
    },
    nextSlide() {
      this.setSlide(this.slideshowIndex + 1);
    },
    prevSlide() {
      this.setSlide(this.slideshowIndex - 1);
    },
  },
  data() {
    return {
      slideshowIndex: 0,
    };
  },
});

export default component;
</script>
