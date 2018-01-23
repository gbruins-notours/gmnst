<script>
import EmptyLayout from '@/layouts/EmptyLayout'


export default {
    components: {
        EmptyLayout
    },

    created() {
        this.$store.dispatch('LOGIN')
    }
}
</script>


<template>
    <empty-layout></empty-layout>
</template>