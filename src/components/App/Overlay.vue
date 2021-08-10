<template>
  <v-overlay :absolute="absolute" :value="overlayDialog">
    <!-- <v-avatar color="transparent" size="200" rounded> -->
    <div class="d-flex justify-center pb-4">
      <img
        src="../../assets/WhatellzLogo.png"
        alt=""
        class="pulse"
        height="200"
        width="200"
      />
    </div>
    <div class="text-center">{{ overlayDescription }}</div>
    <!-- </v-avatar> -->
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      overlayDialog: 'app/overlayDialog',
      overlayDescription: 'app/overlayDescription',
    }),
  },
}
</script>

<style scoped>
.rotate {
  animation: rotation 8s infinite linear;
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
.pulse {
  animation-name: pulse_animation;
  animation-duration: 1500ms;
  transform-origin: 70% 70%;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes pulse_animation {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.08);
  }
  50% {
    transform: scale(1);
  }
  60% {
    transform: scale(1);
  }
  70% {
    transform: scale(1.05);
  }
  80% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
