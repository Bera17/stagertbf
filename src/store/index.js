import { createStore } from 'vuex'
import * as auth from '../services/authentification'

const store = createStore({
  state: {
    status:'',
    user : {
      userId: -1,
      email:'',
    },
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    auth_login: function(state, user){
      state.status = 'logged';
      state.user = user;
      state.token = user.accessToken
    },
    auth_logout: function(state) {
      state.status= '',
      state.user = {userId:-1, email:''}
      state.token = ''
    },
    setStatus: function(state, status){
      state.status = status
    }
  },
  actions: {
      login: ({commit}, userinfo) => {
        commit('setStatus', 'loading');
          return new Promise((resolve, reject) => {
              auth.login(userinfo.email, userinfo.password)
                  .then((resp) => {
                    localStorage.setItem('token', resp.accessToken)
                    commit('auth_login', resp)
                    resolve();
                  })
                  .catch((err) => {
                    commit('setStatus', err)
                    localStorage.removeItem('token');
                    reject(err);
                  })
          })
      },
      logout: ({commit}) => {
        return new Promise((resolve) => {
          commit('auth_logout')
          localStorage.removeItem('token');
          resolve()
        })
      }
  },
  getters : {
     isLogged: state => !!state.token,
     authStatus: state => state.status
  }
})

export default store