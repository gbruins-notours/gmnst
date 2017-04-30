<template>
    <div id="app">
        <navbar></navbar>
        <router-view></router-view>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import api from './util/api'
import { mapActions } from 'vuex';

export default {
    components: { Navbar },

    methods: {
        ...mapActions([
            'JWT_KEY'
        ])
    },

    created () {
//        api.hashValue('create-a-strong-password-create-a-strong-password')
//            .then((response) => {
//                console.log('HASH', response.data.hash);
//            });

        api.getToken()
            .then((response) => {
                console.log('GET JWT RESPONSE', response.headers['x-authorization']);
                this.JWT_KEY(response.headers['x-authorization'])
            })
            .catch((error) => {
                console.log('GET JWT Error', error);
            });
    }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  justify-content: center;
  margin: 0;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

a {
  color: #42b983;
  text-decoration: none;
}


</style>
