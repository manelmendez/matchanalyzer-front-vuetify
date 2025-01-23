import * as types from '../mutations/mutation-types'
import axios from '@/assets/axios'

export const initializeStore = ({ commit }) => {
  console.log('ACTION -- initializeStore')
  commit(types.INITIALIZE)
}
export const signIn = ({ commit }, credentials) => {
  console.log('ACTION -- signIn')
  return axios
    .post('users/signin', {}, { auth: credentials })
    .then((response) => {
      let authUser = {
        token: response.data.token,
        isLogged: true,
        ...response.data.user
      }
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + response.data.token
      window.localStorage.setItem('authUser', JSON.stringify(authUser))
      commit(types.SIGN_IN, authUser)
      return response
    })
}
export const signUp = ({ commit }, data) => {
  console.log('ACTION -- signUp')
  return axios
    .post('users', data.body, { auth: data.credentials })
    .then((response) => {
      let authUser = {
        token: response.data.token,
        isLogged: true,
        ...response.data.user
      }
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + response.data.token
      window.localStorage.setItem('authUser', JSON.stringify(authUser))
      commit(types.SIGN_UP, authUser)
      return response
    })
}
export const signOut = ({ commit }) => {
  console.log('ACTION -- signOut')
  axios.defaults.headers.common['Authorization'] = null
  window.localStorage.removeItem('authUser')
  commit(types.SIGN_OUT)
}
