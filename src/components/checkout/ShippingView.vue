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

<script>
    import { mapGetters } from 'vuex'

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
                let name = '';

                if(this.cart.shipping_firstName) {
                    name = this.cart.shipping_firstName;
                }

                if(this.cart.shipping_lastName) {
                    if(name) {
                        name += ' ';
                    }

                    name += this.cart.shipping_lastName;
                }

                return name;
            },

            formattedCityStateZip: function() {
                let val = [];

                if(this.cart.shipping_city) {
                    val.push(this.cart.shipping_city)
                }

                if(this.cart.shipping_state || this.cart.shipping_postalCode) {
                    val.push(',');

                    if(this.cart.shipping_state) {
                        val.push(' ' + this.cart.shipping_state);
                    }

                    if(this.cart.shipping_postalCode) {
                        val.push(' ' + this.cart.shipping_postalCode);
                    }
                }

                return val.join('');
            },

            companyDisplay: function() {
                if(this.cart.shipping_company) {
                    return this.cart.shipping_company.toUpperCase()
                }
                return null;
            }
        }
    }
</script>
