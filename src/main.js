import { createApp } from 'vue';
import App from './App.vue';
import "@progress/kendo-theme-default/dist/all.css";
import { WindowInstaller } from '@progress/kendo-window-vue-wrapper'
import { SchedulerInstaller } from '@progress/kendo-scheduler-vue-wrapper'

createApp(App).use(SchedulerInstaller).use(WindowInstaller).mount('#app')
