import { userModule } from './modules/user'
import { competitionModule } from './modules/competition'
import { teamModule } from './modules/team'
import { rootModule } from './modules/root'

import { createStore } from 'vuex'

const store = createStore({
  modules: {
    user: userModule,
    competition: competitionModule,
    team: teamModule,
    root: rootModule
  }
})
export default store
