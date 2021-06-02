import { createApp } from 'vue';
import App from './App.vue';
import "@progress/kendo-theme-default/dist/all.css";
import router from './router'
import store from './store'
import Axios from 'axios'

const app = createApp(App)

app.config.globalProperties.$http = Axios

app.use(store).use(router).mount('#app')
