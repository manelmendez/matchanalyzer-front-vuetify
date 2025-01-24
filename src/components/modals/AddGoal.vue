<template>
  <v-dialog :model-value="show" persistent max-width="400">
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Añadir gol</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row dense>
          <v-col>
            <v-select
              density="compact"
              variant="outlined"
              :model-value="player"
              :items="players"
              item-title="name"
              return-object
              label="Jugador"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              density="compact"
              variant="outlined"
              label="Minuto"
              :max="duration"
              min="0"
              class="centered-input ml-2"
              type="number"
              :model-value="minute"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              density="compact"
              variant="outlined"
              :model-value="asistant"
              :items="players"
              item-title="name"
              return-object
              label="Asistente"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close">Cancelar</v-btn>
        <v-btn
          color="primary"
          :disabled="player == null || minute == null"
          @click="add"
          >Añadir</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    players: {
      type: Array,
      required: true
    },
    duration: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      player: null,
      minute: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    add() {
      this.$emit('confirm', {
        playerId: this.player.id,
        minute: this.minute,
        assist: null
      })
    }
  }
}
</script>

<style scoped></style>
