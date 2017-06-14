<template>
    <section>
        <div class="columns pam">
            <div class="column is-8">
                <div class="title">{{ $t('Shopping Cart') }}</div>
            </div>
        </div>

        <div>

        </div>
    </section>
</template>

<script>
    import Promise from 'bluebird';
    import Vue from 'vue'
    import api from '../../util/api'
    import { mapActions } from 'vuex'

    export default {
        props: ['id'],

        data() {
            return {
                product: {}
            }
        },

//        components: {
//            ProductPrice
//        },

        computed: {

        },

        methods: {

        }
    }
</script>

<style lang="scss">
</style>

