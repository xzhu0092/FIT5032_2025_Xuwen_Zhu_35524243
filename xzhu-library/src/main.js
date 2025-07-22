// main.js
//import './assets/main.css'
//import './style.css'


import { createApp } from 'vue'
import App from './App.vue'

//import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App).mount('#app')

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

import DataTable from 'primevue/datatable'; // Import DataTable component
import Column from 'primevue/column';     // Import Column component

