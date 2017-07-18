<template>
    <section class="container">

        <div v-if="!this.cart.num_items" class="fs16 pal tac">
            {{ $t('Your shopping cart does not contain any items.') }}
        </div>

        <template v-else>
            <checkout-steps :step="3"></checkout-steps>

            <div class="widthAll">







            </div>
        </template>

    </section>
</template>

<script>
    import Vue from 'vue'



    export default {








        created() {
          this.createBraintree();
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>

<style lang="scss">
    .cvvHelpCell {
        display: inline-block;
        text-align: left;
    }

    .card-icon {
        padding-top: 2px;
        width: 50px;
    }
</style>
