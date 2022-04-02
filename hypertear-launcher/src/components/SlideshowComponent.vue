<template>
  <div id="slideshow">
    <div class="slideshowItem">
      <img src="@/assets/Bot1.png" alt="Failed to load slideshow" />
    </div>
    <div class="slideshowItem">
      <img src="@/assets/Bot2.png" alt="Failed to load slideshow" />
    </div>
    <button @click="nextSlide()" class="next">&#10095;</button>
    <button @click="prevSlide()" class="prev">&#10094;</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const slides = document.getElementsByClassName("slideshowItem");

let timeout: NodeJS.Timeout;

const component = defineComponent({
  mounted() {
    timeout = setTimeout(this.nextSlide, 4000);
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
