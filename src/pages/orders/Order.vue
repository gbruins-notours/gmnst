<template>
    <section class="container">
        <div class="container-skinny">

            <div class="fs30 tac mtl fwb">
                <i class="fa fa-hand-peace-o vab mrs"></i>
                {{ $t('Thanks.') }}
            </div>

            <div class="displayTable mha">
                <div class="mtl">
                    <div class="fwb">{{ $t('Shipping to') }}:</div>
                    <div>
                        <div>{{ formattedName }}</div>
                        <div v-if="order.shipping.company">{{ companyDisplay }}</div>
                        <div>{{ order.shipping.streetAddress }}</div>
                        <div v-if="order.shipping.extendedAddress">{{ order.shipping.extendedAddress }}</div>
                        <div>{{ formattedCityStateZip }}</div>
                        <div>{{ order.shipping.countryCodeAlpha2 }}</div>
                    </div>
                </div>

                <div class="mtl">
                    <div class="displayTableRow">
                        <div class="displayTableCell prm pbs">{{ $t('# items') }}:</div>
                        <div class="displayTableCell fwb pbs">{{ order.shoppingCart.num_items }}</div>
                    </div>

                    <div class="displayTableRow">
                        <div class="displayTableCell prm pbs">{{ $t('Total') }}:</div>
                        <div class="displayTableCell fwb pbs">{{ $n(order.amount, 'currency') }}</div>
                    </div>

                    <div class="displayTableRow">
                        <div class="displayTableCell prm pbs">{{ $t('Payment') }}:</div>
                        <div class="displayTableCell fwb pbs">{{ paymentPhrase }}</div>
                    </div>

                    <div class="displayTableRow">
                        <div class="displayTableCell prm pbs">{{ $t('Order') }}:</div>
                        <div class="displayTableCell fwb pbs">
                            <a v-if="order.id" :click="goToOrders()">{{ order.transaction_id }}</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    import api from '../../util/api'
    import checkoutService from '../../util/checkoutService'

    export default {

        computed: {
            paymentPhrase: function() {
                if(this.order.creditCard.cardType) {
                    if(this.order.creditCard.last4) {
                        return this.$t('payment_type_phrase', { type: this.order.creditCard.cardType, last4: this.order.creditCard.last4 })
                    }
                    return this.order.creditCard.cardType;
                }

                // TODO: Paypal
                return null;
            },

            formattedName() {
                if(this.order.shipping) {
                    return checkoutService.getFormattedShippingName(this.order.shipping.firstName, this.order.shipping.lastName);
                }
            },

            formattedCityStateZip: function() {
                if(this.order.shipping) {
                    return checkoutService.getFormattedCityStateZip(
                        this.order.shipping.locality,
                        this.order.shipping.region,
                        this.order.shipping.postalCode
                    );
                }
            },

            companyDisplay: function() {
                if(this.order.shipping) {
                    return checkoutService.getFormattedCompanyName(this.order.shipping.company);
                }
            }
        },

        data: function() {
            return {
                order: {
                    creditCard: {},
                    shipping: {},
                    shoppingCart: {}
                }
            }
        },

        methods: {
            goToOrders: function() {
                return this.$router.push({ 
                    name: 'orders',
                    params: { 
                        id: this.order.transaction_id
                    } 
                });
            }
        },

        created() {
            api.getOrderById(this.$route.params.id)
                .then((order) => {
                    this.order = order;
                });
        }

    }
</script>

<style lang="scss">

</style>
