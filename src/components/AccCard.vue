<template>
  <div>
    <v-card color="card" class="mt-4 mb-6">
      <v-row justify="center" class="pa-2">
        <v-col cols="4">
          <div class="caption d-flex justify-center">Profile Name</div>
          <div class="d-flex justify-center">{{ accObj.name }}</div>
        </v-col>
        <v-col cols="4">
          <div class="d-flex justify-center caption">Profile Number</div>
          <div class="d-flex justify-center">{{ accObj.number }}</div>
        </v-col>
        <v-col>
          <div class="d-flex justify-end">
            <v-btn @click="$emit('edit')" text outlined color="primary">
              Edit
            </v-btn>
          </div>
        </v-col>
        <v-col>
          <div class="d-flex justify-start">
            <v-btn @click="$emit('delete')" text outlined color="primary">
              Delete
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    accObj: {
      type: Object,
      required: true,
    },
  },
  methods: {},
}
</script>

<style></style>
