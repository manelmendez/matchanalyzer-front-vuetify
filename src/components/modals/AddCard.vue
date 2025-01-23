<template>
  <v-dialog :model-value="show" persistent max-width="450">
    <v-card>
      <v-card-title class="text-h5">Añadir Tarjeta</v-card-title>
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
            <v-select
              density="compact"
              variant="outlined"
              :model-value="type"
              :items="types"
              item-title="type"
              label="Tipo"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              density="compact"
              variant="outlined"
              label="Minuto"
              :max="duration"
              class="centered-input ml-2"
              type="number"
              :model-value="minute"
              required
            ></v-text-field>
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
      minute: null,
      type: null,
      types: ['amarilla', 'roja']
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    add() {
      this.$emit('confirm', {
        playerId: this.player.id,
        type: this.type,
        minute: this.minute
      })
    }
  }
}
</script>

<style scoped></style>
