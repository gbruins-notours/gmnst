<script>
import { mapActions } from 'vuex';
import EmptyLayout from '@/layouts/EmptyLayout'


export default {
    components: {
        EmptyLayout
    },

    methods: {
        ...mapActions([
            'LOGIN'
        ])
    },

    created() {
        this.LOGIN()
    }
}
</script>


<template>
    <empty-layout></empty-layout>
</template>