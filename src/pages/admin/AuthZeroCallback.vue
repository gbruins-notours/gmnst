<script>
import { Loading } from 'element-ui';
import EmptyLayout from '@/layouts/EmptyLayout'

let loadingInstance = null;

export default {
    name: 'callback',

    components: {
        EmptyLayout
    },

    mounted: function() {
        loadingInstance = Loading.service({ 
            fullscreen: true 
        });

        this.$store.dispatch('HANDLE_AUTHENTICATION')
            .then(() => {
                this.$router.push({ name: 'adminProducts' });
            })
            .catch((err) => {
                this.$router.push({ name: 'home' });
            })
            .finally(() => {
                loadingInstance.close();
            })
    }
}
</script>


<template>
  <empty-layout></empty-layout>
</template>