<template>
  <div id="nav" v-if="isAuthenticated">
    <fab
            :text="'Se deconnecter'"
            :align="{ horizontal: 'end', vertical: 'top' }"
            :positionMode="'absolute'"
            @click="handleLogout"
    />
  </div>
  <scheduler v-if="isAuthenticated" />
  <auth-view v-else @submit="handleLogin"/>
</template>

<script>
import AuthView from './components/AuthView.vue'
import Scheduler from './components/Scheduler.vue'
import { FloatingActionButton } from '@progress/kendo-vue-buttons';

import * as auth from './services/authentification'

export default {
  name: 'App',
  components: {
    "scheduler": Scheduler,
    "auth-view": AuthView,
    fab: FloatingActionButton,
  },
  data(){
    return {
      isAuthenticated: null,
    }
  },
  methods:{
    handleLogin: function(result){
      console.log(result);
      console.log(result.account);
      this.isAuthenticated!==undefined ? result.account : {account:"dd"};
      this.$forceUpdate();
    },
    handleLogout: function(){
      console.log(this.isAuthenticated);
      console.log("event :: logout");
      this.isAuthenticated = auth.logout();
      this.$forceUpdate();
    }
  },
  mounted(){
    if(localStorage.email)
      this.isAuthenticated = auth.getAccount(localStorage.email, localStorage.password)
  },
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
</style>
