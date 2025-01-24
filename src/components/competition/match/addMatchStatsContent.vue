<template>
  <v-col>
    <v-form>
      <v-row dense class="mr-5 ml-5">
        <v-col cols="9" class="text-center">
          <v-select
            variant="outlined"
            :model-value="matchpart.formation"
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
            :model-value="matchpart.time"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mr-5 ml-5" dense>
        <v-col>
          <v-row class="mb-2 text-center" justify="center" align="center" dense>
            Añadir jugadores:
            <v-btn
              class="ml-2"
              color="accent"
              size="x-small"
              icon="mdi-plus"
              @click.stop="addMinuteDialog = true"
            ></v-btn>
            <AddPlayer
              v-if="addMinuteDialog"
              :show="addMinuteDialog"
              :players="team.players"
              @close="addMinuteDialog = false"
              @confirm="addNewMinute"
              @create-guest-player="createGuestPlayer"
            ></AddPlayer>
          </v-row>
          <v-row dense v-if="minutes">
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="4"
              xl="4"
              v-for="(minute, index) in minutes"
              :key="index"
            >
              <v-row dense>
                <v-col class="players-content">
                  <v-chip
                    class="ma-2"
                    color="primary"
                    closable
                    @click:close="delMinute(minute.id)"
                  >
                    <v-avatar start class="bg-primary-darken-4">
                      {{ minute['position'] }}
                    </v-avatar>
                    {{ getPlayerById(minute['playerId']) }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense class="mr-5 ml-5">
        <v-col>
          <v-row dense class="mb-2 text-center" justify="center" align="center">
            Añadir goles:
            <v-btn
              class="ml-2"
              color="accent"
              size="x-small"
              icon="mdi-plus"
              @click.stop="addgoalDialog = true"
            >
            </v-btn>
            <AddGoal
              v-if="addgoalDialog"
              :show="addgoalDialog"
              :players="team.players"
              :duration="Number(matchpart.time)"
              @close="addgoalDialog = false"
              @confirm="addNewGoal"
            ></AddGoal>
          </v-row>
          <v-row dense v-if="goals">
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="6"
              xl="6"
              v-for="(goal, index) in goals"
              :key="index"
            >
              <v-row dense>
                <v-col class="players-content">
                  <v-chip
                    class="ma-2"
                    color="primary"
                    closable
                    @click:close="delGoal(goal.id)"
                  >
                    {{ getPlayerById(goal['playerId']) }}
                    <v-icon>mdi-soccer</v-icon> min.{{
                      parseInt(goal['minute']) + prevPartMinutes
                    }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense class="mr-5 ml-5">
        <v-col>
          <v-row dense class="mb-2 text-center" justify="center" align="center">
            Añadir tarjetas:
            <v-btn
              class="ml-2"
              color="accent"
              size="x-small"
              icon="mdi-plus"
              @click.stop="addcardDialog = true"
            >
            </v-btn>
            <AddCard
              v-if="addcardDialog"
              :show="addcardDialog"
              :players="team.players"
              :duration="Number(matchpart.time)"
              @close="addcardDialog = false"
              @confirm="addNewCard"
            ></AddCard>
          </v-row>
          <v-row dense v-if="cards">
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="6"
              xl="6"
              v-for="(card, index) in cards"
              :key="index"
            >
              <v-row dense>
                <v-col class="players-content">
                  <v-chip
                    class="ma-2"
                    color="primary"
                    closable
                    @click:close="delCard(card.id)"
                  >
                    {{ getPlayerById(card['playerId']) }}
                    <v-icon
                      :color="card['type'] == 'amarilla' ? 'yellow' : 'red'"
                      >mdi-cards</v-icon
                    >
                    min.{{ parseInt(card['minute']) + prevPartMinutes }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense class="mr-5 ml-5">
        <v-col>
          <v-row dense class="text-center" justify="center" align="center">
            Añadir cambios:
            <v-btn
              class="ml-2"
              color="accent"
              size="x-small"
              icon="mdi-plus"
              @click.stop="addsubDialog = true"
            ></v-btn>
            <AddSub
              v-if="addsubDialog"
              :show="addsubDialog"
              :players="team.players"
              :duration="Number(matchpart.time)"
              @close="addsubDialog = false"
              @confirm="addNewSub"
            ></AddSub>
          </v-row>
          <v-row dense v-if="substitutions">
            <v-col
              cols="12"
              sm="12"
              md="12"
              lg="6"
              xl="6"
              v-for="(sub, index) in substitutions"
              :key="index"
            >
              <v-row dense>
                <v-col class="players-content">
                  <v-chip
                    class="ma-2"
                    color="primary"
                    closable
                    @click:close="delSub(sub.id)"
                  >
                    {{ getPlayerById(sub['playerOut']) }}
                    <v-icon>mdi-cached</v-icon>
                    {{ getPlayerById(sub['playerIn']) }}
                  </v-chip>
                  <p>min.{{ parseInt(sub['minute']) + prevPartMinutes }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>
<script>
import AddPlayer from '@/components/modals/AddPlayer.vue'
import AddGoal from '@/components/modals/AddGoal.vue'
import AddCard from '@/components/modals/AddCard.vue'
import AddSub from '@/components/modals/AddSub.vue'
import { mapActions } from 'vuex'
export default {
  props: {
    team: {
      type: Object,
      required: true
    },
    roundId: {
      type: Number,
      required: true
    },
    matchId: {
      type: Number,
      required: true
    },
    matchpart: {
      type: Object,
      required: true
    },
    prevPartMinutes: {
      type: Number,
      required: true
    }
  },
  components: {
    AddPlayer,
    AddGoal,
    AddCard,
    AddSub
  },
  data() {
    return {
      formacionesF7: [
        {
          name: '3-2-1',
          image: () => import('@/assets/images/formaciones/3-2-1.png')
        },
        {
          name: '2-3-1',
          image: () => import('@/assets/images/formaciones/2-3-1.png')
        },
        {
          name: '3-1-2',
          iimage: () => import('@/assets/images/formaciones/3-1-2.png')
        },
        {
          name: '3-3',
          image: () => import('@/assets/images/formaciones/3-3.png')
        },
        {
          name: '4-2',
          image: () => import('@/assets/images/formaciones/4-2.png')
        }
      ],
      addMinuteDialog: false,
      addgoalDialog: false,
      addcardDialog: false,
      addsubDialog: false
    }
  },
  methods: {
    ...mapActions({
      addPlayer: 'team/addPlayer',
      addMinute: 'competition/addMinute',
      addGoal: 'competition/addGoal',
      addAssist: 'competition/addAssist',
      addCard: 'competition/addCard',
      addSubstitution: 'competition/addSubstitution',
      deleteMinute: 'competition/deleteMinute',
      deleteGoal: 'competition/deleteGoal',
      deleteAssist: 'competition/deleteAssist',
      deleteCard: 'competition/deleteCard',
      deleteSubstitution: 'competition/deleteSubstitution'
    }),
    close() {
      this.$emit('close')
    },
    async createGuestPlayer(data) {
      let player = {
        firstname: data.firstname,
        lastname: data.lastname,
        position: null,
        year: null,
        teamId: this.team.id,
        guest: true
      }
      this.addPlayer(player).then((response) => {
        if (response.status === 200) {
          console.log(response)
        }
      })
    },
    async addNewMinute(data) {
      let minute = {
        ...data,
        roundId: this.roundId,
        matchId: this.matchId,
        matchpartId: this.matchpart.id
      }
      let response = await this.addMinute(minute)
      if (response.status == 200) {
        this.minutes.push(response.data.minuteSaved)
      }
      this.addMinuteDialog = false
    },
    async addNewGoal(data) {
      let goal = {
        ...data,
        roundId: this.roundId,
        matchId: this.matchId,
        matchpartId: this.matchpart.id
      }
      let response = await this.addGoal(goal)
      if (response.status == 200) {
        this.goals.push(response.data.goalSaved)
      }
      this.addgoalDialog = false
    },
    async addNewCard(data) {
      let card = {
        ...data,
        roundId: this.roundId,
        matchId: this.matchId,
        matchpartId: this.matchpart.id
      }
      let response = await this.addCard(card)
      if (response.status == 200) {
        this.cards.push(response.data.cardSaved)
      }
      this.addcardDialog = false
    },
    async addNewSub(data) {
      let sub = {
        ...data,
        roundId: this.roundId,
        matchId: this.matchId,
        matchpartId: this.matchpart.id
      }
      let response = await this.addSubstitution(sub)
      if (response.status == 200) {
        this.substitutions.push(response.data.substitutionSaved)
      }
      this.addsubDialog = false
    },
    async delMinute(id) {
      let response = await this.deleteMinute(id)
      if (response.status == 200) {
        let index = this.minutes.findIndex((minute) => minute.id == id)
        this.minutes.splice(index, 1)
      }
    },
    async delGoal(id) {
      let response = await this.deleteGoal(id)
      if (response.status == 200) {
        let index = this.goals.findIndex((goal) => goal.id == id)
        this.goals.splice(index, 1)
      }
    },
    async delAssist(id) {
      let response = await this.deleteAssist(id)
      if (response.status == 200) {
        let index = this.assists.findIndex((assist) => assist.id == id)
        this.assists.splice(index, 1)
      }
    },
    async delCard(id) {
      let response = await this.deleteCard(id)
      if (response.status == 200) {
        let index = this.cards.findIndex((card) => card.id == id)
        this.cards.splice(index, 1)
      }
    },
    async delSub(id) {
      let response = await this.deleteSubstitution(id)
      if (response.status == 200) {
        let index = this.substitutions.findIndex(
          (substitution) => substitution.id == id
        )
        this.substitutions.splice(index, 1)
      }
    },
    getPlayerById(id) {
      let player = this.team.players.find((p) => p.id == id)
      return player.name
    }
  },
  computed: {
    minutes() {
      return this.$store.getters['competition/minutesByMatchpart'](
        this.matchpart.id
      )
    },
    goals() {
      return this.$store.getters['competition/goalsByMatchpart'](
        this.matchpart.id
      )
    },
    assists() {
      return this.$store.getters['competition/assistsByMatchpart'](
        this.matchpart.id
      )
    },
    cards() {
      return this.$store.getters['competition/cardsByMatchpart'](
        this.matchpart.id
      )
    },
    substitutions() {
      return this.$store.getters['competition/substitutionsByMatchpart'](
        this.matchpart.id
      )
    }
  }
}
</script>
<style scoped>
.players-content {
  font-size: 14px;
  font-weight: lighter;
}
</style>
