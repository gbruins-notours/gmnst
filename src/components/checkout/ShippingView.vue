<template>
    <div>
        <div>{{ formattedName }}</div>
        <div v-if="cart.shipping.company">{{ companyDisplay }}</div>
        <div>{{ cart.shipping.streetAddress }}</div>
        <div v-if="cart.shipping.extendedAddress">{{ cart.shipping.extendedAddress }}</div>
        <div>{{ formattedCityStateZip }}</div>
        <div>{{ cart.shipping.countryCodeAlpha2 }}</div>
        <div class="pts" v-if="showEmail">{{ cart.shipping.email }}</div>
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

        computed: {
            ...mapGetters([
                'cart'
            ]),

            formattedName: function() {
                return `${this.cart.shipping.firstName} ${this.cart.shipping.lastName}`;
            },

            formattedCityStateZip: function() {
                return `${this.cart.shipping.city}, ${this.cart.shipping.state} ${this.cart.shipping.postalCode}`;
            },

            companyDisplay: function() {
                if(this.cart.shipping.company) {
                    return this.cart.shipping.company.toUpperCase()
                }
                return null;
            }
        }
    }
</script>
