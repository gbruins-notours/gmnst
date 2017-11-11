<script>
import Vue from 'vue'
import PaymentTypeDisplay from '../../components/PaymentTypeDisplay'
import OrderService from './order_service.js'
import ShoppingCartService from '../cart/shopping_cart_service.js'


let orderService = new OrderService();
let shoppingCartService = new ShoppingCartService();


export default {

    components: {
        PaymentTypeDisplay
    },

    computed: {
        formattedName() {
            if(this.order.shipping) {
                return shoppingCartService.getFormattedShippingName(this.order.shipping.firstName, this.order.shipping.lastName);
            }
        },

        formattedCityStateZip: function() {
            if(this.order.shipping) {
                return shoppingCartService.getFormattedCityStateZip(
                    this.order.shipping.locality,
                    this.order.shipping.region,
                    this.order.shipping.postalCode
                );
            }
        },

        companyDisplay: function() {
            if(this.order.shipping) {
                return shoppingCartService.getFormattedCompanyName(this.order.shipping.company);
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
        goToOrderDetails: function() {
            return this.$router.push({ 
                name: 'order_details',
                params: { 
                    id: this.order.transaction_id
                } 
            });
        }
    },

    created() {
        orderService.getOrder(this.$route.params.id).then((order) => {
            this.order = order;
        });
    }
}
</script>

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
                        <div class="displayTableCell prm pbs">{{ $t('Payment method') }}:</div>
                        <div class="displayTableCell fwb pbs">
                            <payment-type-display :card-type="order.creditCard.cardType" :last-four="order.creditCard.last4"></payment-type-display>
                        </div>
                    </div>

                    <div class="displayTableRow">
                        <div class="displayTableCell prm pbs">{{ $t('Order') }}:</div>
                        <div class="displayTableCell fwb pbs">
                            <a v-if="order.id" :click="goToOrderDetails()">{{ order.transaction_id }}</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>
