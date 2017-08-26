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
                let name = '';

                if(this.cart.shipping.firstName) {
                    name = this.cart.shipping.firstName;
                }

                if(this.cart.shipping.lastName) {
                    if(name) {
                        name += ' ';
                    }

                    name += this.cart.shipping.lastName;
                }

                return name;
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
