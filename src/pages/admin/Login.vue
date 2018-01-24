<script>
import EmptyLayout from '@/layouts/EmptyLayout'


export default {
    components: {
        EmptyLayout
    },

    created() {
        this.$store.dispatch('auth/LOGIN')
    }
}
</script>


<template>
    <empty-layout></empty-layout>
</template>