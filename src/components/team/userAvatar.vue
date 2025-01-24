<template>
  <v-avatar class="text-white" :size="size" color="primary">
    {{ initials }}
  </v-avatar>
</template>

<script>
export default {
  props: {
    firstname: {
      required: true
    },
    lastname: {
      required: true
    },
    size: {
      type: Number,
      default: 34
    }
  },
  computed: {
    initials() {
      let initials = ''
      let nameParts = [this.firstname, this.lastname]
      for (const namePart of nameParts) {
        if (namePart) {
          initials += namePart.charAt(0).toUpperCase()
        }
      }
      return initials
    }
  }
}
</script>

<style></style>
