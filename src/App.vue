<template>
  <div id="nav" v-if="this.$store.getters.isLogged">
    <k-button id="logoutButton"
              @click="handleLogout" 
              :icon="'logout'" 
              :look="'outline'" ></k-button>
  </div>
  <router-view></router-view>
</template>

<script>
import { Button } from '@progress/kendo-vue-buttons';

export default {
  name: 'App',
  components: {
    'k-button': Button,
  },
  data(){
    return {}
  },
  methods:{
    handleLogout: function(){
      this.$store.dispatch('logout');
      this.$router.push('/')
    }
  },
  created(){
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('logout')
        }
        throw err;
      });
    });
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#nav {
  text-align: end;
}
#logoutButton {
  width: 60px;
}
</style>
