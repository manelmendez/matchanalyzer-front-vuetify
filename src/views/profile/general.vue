<template>
  <v-container fluid>
    <v-row class="my-2" justify="center" align="center">
      <v-col cols="12" md="6" justify="center" align="center">
        <v-avatar v-if="user.avatar != null" size="100">
          <img :src="user.avatar" alt="Profile" />
        </v-avatar>
        <UserAvatar
          v-else
          :size="100"
          :firstname="user.firstname"
          :lastname="user.lastname"
        ></UserAvatar>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="mx-auto">
        <v-card>
          <v-card-text>
            <v-btn
              variant="text"
              icon="mdi-pencil"
              color="gray"
              class="edit-icon"
              v-if="editing == false"
              @click="editing = true"
            >
            </v-btn>
            <v-col>
              <label><b>Nombre</b></label>
              <div v-if="!editing">{{ user.firstname }}</div>
              <v-text-field
                v-else
                density="compact"
                v-model="user.firstname"
              ></v-text-field>
            </v-col>
            <v-col>
              <label><b>Apellidos</b></label>
              <div v-if="!editing">{{ user.lastname }}</div>
              <v-text-field v-else density="compact" v-model="user.lastname"></v-text-field>
            </v-col>
            <v-col>
              <label><b>Email</b></label>
              <div v-if="!editing">{{ user.email }}</div>
              <v-text-field v-else density="compact" v-model="user.email"></v-text-field>
            </v-col>
            <v-col>
              <label><b>Rol</b></label>
              <div>{{ user.role }}</div>
            </v-col>
            <v-col>
              <label><b>Fecha de registro</b></label>
              <div>
                {{
                  moment(user.signupDate).format('DD/MM/YYYY hh:mm:ss')
                }}
              </div>
            </v-col>
          </v-card-text>
          <v-card-actions v-if="editing == true">
            <v-spacer></v-spacer>
            <v-btn color="white" variant="text" @click="editing = false">
              Cancelar
            </v-btn>
            <v-btn color="primary" @click="editing = false"> Guardar </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import UserAvatar from '@/components/team/userAvatar.vue'
export default {
  name: 'ProfileGeneral',
  components: { UserAvatar },
  data() {
    return {
      moment: moment,
      editing: false
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/user']
    }
  }
}
</script>

<style>
img {
  border: 2px solid rgb(221, 221, 221);
}
.edit-icon {
  position: absolute;
  right: 2px;
  top: 2px;
  cursor: pointer;
}
</style>
