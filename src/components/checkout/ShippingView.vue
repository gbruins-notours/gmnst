<script>
    import { mapGetters } from 'vuex'
    import ShoppingCartService from '../../pages/cart/shopping_cart_service.js'

    let shoppingCartService = new ShoppingCartService();

    export default {
        props: {
            showEmail: {
                type: Boolean,
                default: true
            }
        },

        // NOTE: any reference to a variable outside the scope of a Vue instance
        // will not be reactive, so using the cart from the getter will not work.
        // Need to use this.$store.state instead
        // Need to use https://stackoverflow.com/questions/45307974/vue-2-vuex-using-state-variables-in-computed-property#45308643
        computed: {
            ...mapGetters([
                'cart'
            ]),

            formattedName() {
                return shoppingCartService.getFormattedShippingName(this.cart.shipping_firstName, this.cart.shipping_lastName);
            },

            formattedCityStateZip: function() {
                return shoppingCartService.getFormattedCityStateZip(
                    this.cart.shipping_city, 
                    this.cart.shipping_state,
                    this.cart.shipping_postalCode
                );
            },

            companyDisplay: function() {
                return shoppingCartService.getFormattedCompanyName(this.cart.shipping_company);
            }
        }
    }
</script>


<template>
    <div>
        <div>{{ formattedName }}</div>
        <div v-if="cart.shipping_company">{{ companyDisplay }}</div>
        <div>{{ cart.shipping_streetAddress }}</div>
        <div v-if="cart.shipping_extendedAddress">{{ cart.shipping_extendedAddress }}</div>
        <div>{{ formattedCityStateZip }}</div>
        <div>{{ cart.shipping_countryCodeAlpha2 }}</div>
        <div class="pts" v-if="showEmail">{{ cart.shipping_email }}</div>
    </div>
</template>