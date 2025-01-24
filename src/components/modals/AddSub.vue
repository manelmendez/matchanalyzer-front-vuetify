<template>
  <v-dialog :model-value="show" persistent max-width="400">
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Añadir sustitución</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-select
              density="compact"
              variant="outlined"
              :model-value="playerOut"
              :items="players"
              item-title="name"
              return-object
              label="Sale"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              density="compact"
              variant="outlined"
              :model-value="playerIn"
              :items="players"
              item-title="name"
              return-object
              label="Entra"
            ></v-select>
          </v-col>
          <v-col cols="12">
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
          :disabled="playerIn == null || playerOut == null || minute == null"
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
      playerIn: null,
      playerOut: null,
      minute: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    add() {
      this.$emit('confirm', {
        playerIn: this.playerIn.id,
        playerOut: this.playerOut.id,
        minute: this.minute
      })
    }
  }
}
</script>

<style scoped></style>
