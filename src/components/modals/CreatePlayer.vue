<template>
  <v-dialog v-if="show" :model-value="show" width="70%" persistent>
    <v-card>
      <v-card-title>
        <v-toolbar color="primary">
          <v-toolbar-title>Crear jugador</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row align="center" justify="center">
            <v-col cols="12" md="4" align="center" justify="center">
              <input
                type="file"
                ref="file"
                @change="onFileChanged"
                style="display: none"
              />
              <v-avatar
                v-if="!image"
                size="100px"
                class="uploadPhoto"
                @click="launchFilePicker"
                style="cursor: pointer"
              >
                <v-icon>add_a_photo</v-icon>
              </v-avatar>
              <v-img
                v-else
                style="cursor: pointer"
                height="100px"
                :src="image"
                @click="launchFilePicker"
                @error="image = constants.DEFAULT_PLAYER_URL"
                cover
              />
            </v-col>
            <v-col cols="12" md="8">
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
                <v-col cols="12" md="6">
                  <v-select
                    :items="positions"
                    label="Posicion"
                    :model-value="position"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    :items="years"
                    label="Año de nacimiento"
                    :model-value="year"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="player ? editPlayer() : createPlayer()"
          >Continue</v-btn
        >
        <v-btn variant="text" @click="close()">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from 'vuex'
import constants from '../../assets/constants/constants'

export default {
  props: {
    show: Boolean,
    player: Object
  },
  data() {
    return {
      constants: constants,
      image: this.player ? constants.ADDRESS + this.player.avatar : null,
      file: null,
      firstname: this.player ? this.player.firstname : '',
      lastname: this.player ? this.player.lastname : '',
      position: this.player ? this.player.position : '',
      year: this.player ? this.player.year : '',
      positions: constants.positions,
      years: constants.years
    }
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click()
    },
    onFileChanged(event) {
      this.image = URL.createObjectURL(event.target.files[0])
      this.file = event.target.files[0]
    },
    async createPlayer() {
      if (this.file != null) {
        const fd = new FormData()
        fd.append('image', this.file, this.file.name)
        console.log(fd)
        try {
          const response = await this.uploadImage(fd)
          let player = {
            firstname: this.firstname,
            lastname: this.lastname,
            position: this.position,
            year: this.year,
            team: this.$route.params.id,
            guest: false
          }
          if (response.status == 200) {
            player.avatar = response.data
          }
          this.addPlayer(player).then((response) => {
            if (response.status === 200) {
              this.$emit('confirm')
            }
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        let player = {
          firstname: this.firstname,
          lastname: this.lastname,
          position: this.position,
          year: this.year,
          team: this.$route.params.id,
          guest: false
        }
        this.addPlayer(player).then((response) => {
          if (response.status === 200) {
            this.$emit('confirm')
          }
        })
      }
    },
    editPlayer() {
      let player = {
        id: this.player.id,
        firstname: this.firstname,
        lastname: this.lastname,
        position: this.position,
        year: this.year,
        team: this.$route.params.id
      }
      this.updatePlayer(player).then(() => {
        this.$emit('confirm')
      })
    },
    close() {
      this.$emit('close')
    },
    ...mapActions('team', ['addPlayer', 'updatePlayer', 'uploadImage'])
  }
}
</script>
<style scoped></style>
