<template>
  <v-snackbar :model-value="show" location="bottom left" :color="color">
    {{ text }}
    <template v-slot:action>
      <v-btn color="black" variant="text" @click="close"> Close </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  name: 'Snackbar-Component',
  props: {
    show: Boolean,
    text: String,
    color: String
  },
  methods: {
    close() {
      this.$store.commit('root/SNACKBAR_OFF')
    }
  }
}
</script>
<style scoped></style>
