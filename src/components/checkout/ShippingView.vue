<template>
    <div>
        <div>{{ formattedName }}</div>
        <div v-if="$store.state.cart.shipping_company">{{ companyDisplay }}</div>
        <div>{{ $store.state.cart.shipping_streetAddress }}</div>
        <div v-if="$store.state.cart.shipping_extendedAddress">{{ $store.state.cart.shipping_extendedAddress }}</div>
        <div>{{ formattedCityStateZip }}</div>
        <div>{{ $store.state.cart.shipping_countryCodeAlpha2 }}</div>
        <div class="pts" v-if="showEmail">{{ $store.state.cart.shipping_email }}</div>
    </div>
</template>

<script>
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
            formattedName: function() {
                let name = '';

                console.log("FORMATTD NAME", this.$store.state.cart)

                if(this.$store.state.cart.shipping_firstName) {
                    name = this.$store.state.cart.shipping_firstName;
                }

                if(this.$store.state.cart.shipping_lastName) {
                    if(name) {
                        name += ' ';
                    }

                    name += this.$store.state.cart.shipping_lastName;
                }

                return name;
            },

            formattedCityStateZip: function() {
                return `${this.$store.state.cart.shipping_city}, ${this.$store.state.cart.shipping_state} ${this.$store.state.cart.shipping_postalCode}`;
            },

            companyDisplay: function() {
                if(this.$store.state.cart.shipping_company) {
                    return this.$store.state.cart.shipping_company.toUpperCase()
                }
                return null;
            }
        }
    }
</script>
