import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login.vue'
import register from '../views/register.vue'
import index from '../views/index.vue'
import error404 from '../views/error/404.vue'
import error500 from '../views/error/500.vue'
import teams from '../views/teams/index.vue'
import team from '../views/teams/_id/index.vue'
import competitionList from '../views/competitions/index.vue'
import competitionBase from '../views/competitions/_id/index.vue'
import summary from '../views/competitions/_id/summary.vue'
import results from '../views/competitions/_id/results.vue'
import classification from '../views/competitions/_id/classification.vue'
import competitionStats from '../views/competitions/_id/team/_id.vue'
import planification from '../views/planification/index.vue'
import profile from '../views/profile/general.vue'
import match from '../views/competitions/_id/match/_id.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { requiresAuth: false, onceLogged: true, layout: 'empty' }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta: { requiresAuth: false, onceLogged: true, layout: 'empty' }
    },
    {
      path: '/',
      name: 'index',
      component: index,
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/teams',
      name: 'teams',
      component: teams,
      meta: { requiresAuth: true, layout: 'default' },
    },
    {
      path: '/teams/:id',
      name: 'teams-id',
      component: team,
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/competitions',
      name: 'competitions',
      component: competitionList,
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/competitions/:id/round/:roundId',
      name: 'competition-id',
      component: competitionBase,
      meta: { requiresAuth: true, layout: 'default' },
      children: [
        {
          path: 'summary',
          name: 'summary',
          component: summary,
          meta: { requiresAuth: true, layout: 'default' }
        },
        {
          path: 'results',
          name: 'results',
          component: results,
          meta: { requiresAuth: true, layout: 'default' }
        },
        {
          path: 'rankings',
          name: 'classification',
          component: classification,
          meta: { requiresAuth: true, layout: 'default' }
        }
      ]
    },
    {
      path: '/competitions/:id/match/:matchId',
      name: 'match-id',
      component: match,
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/competitions/:id/team/:teamId',
      name: 'competitionStats',
      component: competitionStats,
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/planification',
      name: 'planification',
      component: planification,
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/profile/general',
      name: 'profile',
      component: profile,
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/500',
      name: 'error500',
      component: error500,
      meta: { requiresAuth: false, layout: 'empty' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: error404,
      meta: { requiresAuth: false, layout: 'empty' }
    }
  ]
})
/**
 * Function to check some things before redirect to a page
 *
 */
router.beforeEach((to, from, next) => {
  // method to check if user needs to be logged to access a page
  if (to.meta.requiresAuth) {
    const authUser = JSON.parse(window.localStorage.getItem('authUser'))
    if (!authUser) {
      next({ name: 'login' })
    } else {
      isAuth()
      next()
    }
  }
  // method to not allow a user to go to certain pages once logged
  else if (to.meta.onceLogged) {
    const authUser = JSON.parse(window.localStorage.getItem('authUser'))
    if (authUser) {
      next({ name: 'index' })
    } else {
      next()
    }
  } else {
    next()
  }
})
function isAuth() {
  // check expiry of token
  try {
    const authUser = JSON.parse(window.localStorage.getItem('authUser'))
    const token = authUser.token
    const tokenDecoded = JSON.parse(atob(token.split('.')[1]))
    if (tokenDecoded.exp < Date.now() / 1000) {
      console.log('Token caducado')
      window.localStorage.removeItem('authUser')
      router.push({ name: 'login' })
    } else {
      console.log('Token válido')
    }
  } catch (error) {
    console.log(error)
  }
}
export default router
