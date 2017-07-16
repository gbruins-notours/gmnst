<template>
    <div>
        <div>{{ formattedName }}</div>
        <div v-if="$store.state.checkout.shipping.company">{{ companyDisplay }}</div>
        <div>{{ $store.state.checkout.shipping.streetAddress }}</div>
        <div v-if="$store.state.checkout.shipping.extendedAddress">{{ $store.state.checkout.shipping.extendedAddress }}</div>
        <div>{{ formattedCityStateZip }}</div>
        <div>{{ $store.state.checkout.shipping.country }}</div>
        <div class="pts" v-if="showEmail">{{ $store.state.checkout.shipping.email }}</div>
    </div>
</template>

<script>
    export default{
        props: {
            showEmail: {
                type: Boolean,
                default: true
            }
        },

        computed: {
            formattedName: function() {
                return `${this.$store.state.checkout.shipping.firstName} ${this.$store.state.checkout.shipping.lastName}`;
            },

            formattedCityStateZip: function() {
                return `${this.$store.state.checkout.shipping.city}, ${this.$store.state.checkout.shipping.state} ${this.$store.state.checkout.shipping.postalCode}`;
            },

            companyDisplay: function() {
                if(this.$store.state.checkout.shipping.company) {
                    return this.$store.state.checkout.shipping.company.toUpperCase()
                }
                return null;
            }
        }
    }
</script>
