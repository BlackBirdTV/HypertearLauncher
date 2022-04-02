<template>
  <div class="home">
    <div class="titlebar">
      <div class="floatRight">
        <a class="minimizeButton" href="javascript:void(0)" @click="minimize()"
          ><i class="fa-solid fa-minus"></i
        ></a>
        <a class="maximizeButton" href="javascript:void(0)" @click="maximize()"
          ><i class="fa-solid fa-plus"></i
        ></a>
        <a class="closeButton" href="javascript:void(0)" @click="close()"
          ><i class="fa-solid fa-times"></i
        ></a>
      </div>
    </div>
    <div class="playBar">
      <div class="floatLeft">
        <PlayButton />
      </div>
      <div class="floatRight">
        <NewsBox
          title="Welcome to the new launcher!"
          url="https://www2.tuhh.de/zll/wp-content/uploads/placeholder.png"
        />
      </div>
    </div>
    <Slideshow />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Slideshow from "@/components/SlideshowComponent.vue";
import NewsBox from "@/components/NewsBox.vue";
import PlayButton from "@/components/PlayButton.vue";
import { ipcRenderer } from "electron";

@Options({
  components: {
    Slideshow,
    NewsBox,
    PlayButton,
  },
  methods: {
    minimize() {
      ipcRenderer.send("minimize");
    },
    maximize() {
      ipcRenderer.send("maximize");
    },
    close() {
      ipcRenderer.send("close");
    },
  },
})
export default class HomeView extends Vue {}
</script>
