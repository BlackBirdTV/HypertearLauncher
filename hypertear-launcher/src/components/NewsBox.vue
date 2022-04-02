<template>
  <div class="newsBox">
    <img :src="url" />
    <span>{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["title", "url"],
});
</script>
