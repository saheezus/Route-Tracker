import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import firebase from "firebase"

var firebaseConfig = {
    apiKey: "[API_KEY]",
    authDomain: "maps-f9f5c.firebaseapp.com",
    projectId: "maps-f9f5c",
    storageBucket: "maps-f9f5c.appspot.com",
    messagingSenderId: "441634846256",
    appId: "1:441634846256:web:4031a2723663df3daa9ff5",
    measurementId: "G-R189DFPWTX"
};
firebase.initializeApp(firebaseConfig);

const app = createApp(App)

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount('#app')
