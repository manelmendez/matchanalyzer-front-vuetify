<template>
  <v-dialog :model-value="show" persistent max-width="400">
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Añadir jugador</v-toolbar-title>
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
            <v-select
              density="compact"
              variant="outlined"
              :model-value="position"
              :items="positions"
              item-title="name"
              label="Posición"
            ></v-select>
          </v-col>
        </v-row>
        <v-row justify="center">
          <a v-if="!addGuest" @click="addGuest = true"
            >o añade un jugador invitado a la lista
          </a>
          <v-col v-else>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Nombre"
                  :model-value="firstname"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Apellidos"
                  :model-value="lastname"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-btn
              size="small"
              color="primary"
              :disabled="firstname == null && lastname == null"
              @click="createGuestPlayer"
              >Añadir a la lista</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close">Cancelar</v-btn>
        <v-btn
          color="primary"
          :disabled="player == null || position == null"
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
    }
  },
  data() {
    return {
      positions: ['PT', 'LD', 'LI', 'CT', 'MCD', 'MC', 'MP', 'ED', 'EI', 'DC'],
      player: null,
      position: null,
      firstname: null,
      lastname: null,
      addGuest: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    add() {
      this.$emit('confirm', {
        playerId: this.player.id,
        position: this.position
      })
    },
    createGuestPlayer() {
      this.$emit('create-guest-player', {
        firstname: this.firstname,
        lastname: this.lastname
      })
    }
  }
}
</script>

<style scoped></style>
