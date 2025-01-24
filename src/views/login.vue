<template>
  <v-main class="welcome-content">
    <v-container text-center>
      <!-- LOGIN -->
      <v-row class="login" wrap justify="center">
        <v-col lg="6" md="6" sm="10" cols="12">
          <v-card class="elevation-0 bg-transparent" style="opacity: 1" title="Iniciar sesión">
            <v-form v-model="valid" ref="form" @submit.prevent="submit()">
              <v-text-field
                prepend-inner-icon="mdi-account"
                ref="email"
                label="Email"
                placeholder="Email"
                type="text"
                v-model="email"
                :rules="emailRules"
                append-icon="nothing"
                required
              ></v-text-field>
              <v-text-field
                prepend-inner-icon="mdi-lock"
                ref="password"
                label="Contraseña"
                hint="At least 8 characters"
                v-model="password"
                min="8"
                :append-icon="e1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (e1 = !e1)"
                :type="e1 ? 'password' : 'text'"
                counter
                :rules="passwordRules"
                required
              ></v-text-field>
            </v-form>
            <v-card-actions class="pa-4 text-end">
              <v-btn
                variant="tonal"
                rounded
                style="padding-right: 10px"
                to="register"
                >Si aún no tienes cuenta</v-btn
              >
              <v-btn
                variant="flat"
                color="accent"
                rounded
                type="submit"
                @click="submit"
                :disabled="!valid"
                >Iniciar sesión</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Login-View',
  data() {
    return {
      //LOGIN
      e1: true,
      valid: true,
      email: '',
      password: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail must be valid'
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => !(v.length < 8) || 'At least 8 characters',
        (v) => !(v.length > 25) || 'Maximum 25 characters'
      ]
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let credentials = {
          username: this.email,
          password: this.password
        }
        this.signIn(credentials).then(() => {
          let snackbar = {
            show: true,
            color: 'success',
            text: 'Logueado correctamente'
          }
          this.$store.commit('root/SNACKBAR', snackbar)
          this.$router.push({
            name: 'index' //si uso path: "/mainpage" el params (props) no funciona -- params: { user: response.data.user } --
          })
        })
      }
    },
    ...mapActions('user', ['signIn'])
  },
  events: {}
}
</script>

<style scoped>
.welcome-content {
  width: 100%;
  min-height: 100%;
  height: 100%;
  position: fixed;
  align-items: center;
  align-content: center;
  justify-content: center;
  background-image: url('../assets/images/background3.jpeg');
  background-size: cover;
}
</style>
