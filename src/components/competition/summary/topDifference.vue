<template>
  <v-card style="overflow: visible;">
    <v-sheet
      class="v-sheet--offset mx-auto"
      color="primary"
      elevation="4"
      max-width="calc(100% - 32px)"
      max-height="calc(100% - 32px)"
      rounded
    >
      <v-list class="bg-transparent" density="compact">
        <v-list-item v-for="i in 4" :key="i" class="text-white" :title="localTopDifference[i - 1].name">
          <template v-slot:prepend>
            <v-avatar tile size="30">
              <v-img
                :src="constants.ADDRESS + localTopDifference[i - 1].avatar"
                @error="localTopDifference[i - 1].avatar = constants.DEFAULT_TEAM_URL"
                cover
              />
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-list-item-action>
              <v-btn variant="text" append-icon="mdi-soccer" size="small">
                {{ localTopDifference[i - 1].stats.goalDif
                }}
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </v-sheet>
    <v-card-text class="pt-0">
      <div class="text-center text-h7 mb-2">Mejor diferencia de goles</div>
    </v-card-text>
  </v-card>
</template>

<script>
import constants from '@/assets/constants/constants'
export default {
  props: {
    topDifference: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localTopDifference: JSON.parse(JSON.stringify(this.topDifference)),
      constants: constants
    }
  }
}
</script>

<style scoped>
.v-sheet--offset {
  top: -15px;
  position: relative;
}
</style>
