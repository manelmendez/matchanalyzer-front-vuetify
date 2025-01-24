<template>
  <v-dialog :model-value="show" persistent max-width="50%">
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Añadir parte</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row dense>
          <v-col cols="9" class="text-center">
            <v-select
              variant="outlined"
              :model-value="formation"
              :items="formacionesF7"
              item-title="name"
              item-value="name"
              label="Elegir formación"
            >
              <template v-slot:item="{ item }">
                <v-row>
                  <v-col cols="2" class="text-center" align-self="center">
                    {{ item.name }}
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <v-img
                      :src="item.image"
                      cover
                      aspect-ratio="4"
                    ></v-img>
                  </v-col>
                </v-row>
              </template>
            </v-select>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              label="Duración"
              class="centered-input ml-2"
              type="number"
              :model-value="duration"
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
          :disabled="formation == '' || duration == undefined"
          @click="add"
          >Añadir</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formation321 from '@/assets/images/formaciones/3-2-1.png';
import formation231 from '@/assets/images/formaciones/2-3-1.png';
import formation312 from '@/assets/images/formaciones/3-1-2.png';
import formation33 from '@/assets/images/formaciones/3-3.png';
import formation42 from '@/assets/images/formaciones/4-2.png';

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      formacionesF7: [
        {
          name: '3-2-1',
          image: formation321
        },
        {
          name: '2-3-1',
          image: formation231
        },
        {
          name: '3-1-2',
          image: formation312
        },
        {
          name: '3-3',
          image: formation33
        },
        {
          name: '4-2',
          image: formation42
        }
      ],
      formation: '',
      duration: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    add() {
      this.$emit('confirm', { formation: this.formation, time: this.duration })
    }
  }
}
</script>

<style scoped></style>
