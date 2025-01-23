<template>
  <v-app>
    <router-view :class="dark ? 'darkContent' : 'content'"></router-view>
  </v-app>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'

export default {
  name: 'EmptyLayout',
  setup() {
    const { proxy } = getCurrentInstance()
    const dark = computed(() => proxy.$vuetify.theme.dark)

    return {
      dark
    }
  }
}
</script>

<style scoped>
.content {
  background-color: var(--v-item-lighten3);
  height: 100%;
}
.darkContent {
  background-color: var(--v-background-base);
  height: 100%;
}
</style>
