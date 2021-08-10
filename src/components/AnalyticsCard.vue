<template>
  <div>
    <v-card class="mx-auto my-8" width="250" height="120" rounded color="card">
      <div :style="cardStyle">
        <v-row>
          <v-col cols="2">
            <v-icon right small size="20" :color="color">
              mdi-filter-variant
            </v-icon>
          </v-col>

          <v-col cols="8">
            <div></div>
          </v-col>

          <v-col cols="2">
            <v-icon small size="20" color="primary-grey">
              mdi-dots-horizontal
            </v-icon>
          </v-col>
          <v-col class="pl-6" cols="12">
            <div class="font-weight-bold h1 px-auto card-main">
              {{ comments }}
            </div>
            <div class="card-bottom caption text--text">
              {{ desc }}
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    comments: {
      type: Number,
      default: 35,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    cardStyle() {
      let color
      if (this.color === 'primary') color = '#f32756'
      if (this.color === 'info') color = '#1d8cf8'
      if (this.color === 'success') color = '#00f2c3'
      return {
        // background: `rgb(36,34,50)`,
        background: `linear-gradient(45deg, #162825 0%, #162825 69%, ${color} 100%)`,
      }
    },
    desc() {
      let text
      if (this.color === 'primary') text = 'Failed Messages'
      if (this.color === 'info') text = 'All Messages'
      if (this.color === 'success') text = 'Successful Messages'
      return text
    },
  },
}
</script>

<style></style>
