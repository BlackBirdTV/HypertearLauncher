<template>
  <button class="playButton" @click="play()">
    <span v-show="status === 'Play'" id="icon">
      <i class="fas fa-circle-play"></i
    ></span>
    {{ " " + status + " " }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";

export default defineComponent({
  methods: {
    play() {
      this.status = "Playing";
      ipcRenderer.send("play");
    },
  },
  mounted() {
    ipcRenderer.on("game-exit", () => {
      this.status = "Play";
    });
  },
  data() {
    return {
      status: "Play",
    };
  },
});
</script>
