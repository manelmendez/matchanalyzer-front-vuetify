import axios from 'axios'
import store from '@/store/store'
import router from '@/router'

const axiosInstance = axios.create({
  baseURL: '/api'
})

axiosInstance.defaults.headers.common['Accept'] = 'application/json';
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axiosInstance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

// add token to Auth header if onceLogged
const authUser = window.localStorage.getItem('authUser');
if (authUser) {
  const parsedAuthUser = JSON.parse(authUser);
  axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + parsedAuthUser.token;
}

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    console.log('error', error)
    let snackbar = {
      show: true,
      color: 'error',
      text: ''
    }
    if (error.response) {
      if (error.response.status == 404) {
        // DO NOTHING FOR NOW
        // TODO
      } else if (error.response.status >= 400) {
        snackbar.text = error.response.data.message
        store.commit('root/SNACKBAR', snackbar)
        // if (error.response.status == 404) {
        //   router.push({name: "error"});
        // }
      } else {
        snackbar.text = 'Error en la petición'
        store.commit('root/SNACKBAR', snackbar)
      }
    } else if (error.request) {
      snackbar.text = 'Se ha perdido la conexión con el servidor'
      router.push('500')
      store.commit('root/SNACKBAR', snackbar)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
