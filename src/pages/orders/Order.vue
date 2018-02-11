<script>
import Vue from 'vue'
import { Loading } from 'element-ui'
import DefaultLayout from '@/layouts/DefaultLayout'
import PaymentTypeDisplay from '@/components/PaymentTypeDisplay'
import orderMixin from './order_mixin'
import OrderService from './OrderService.js'

let orderService = new OrderService();

Vue.use(Loading.directive)

export default {
    components: {
        DefaultLayout,
        PaymentTypeDisplay
    },

    mixins: [
        orderMixin
    ],

    data: function() {
        return {
            loading: true
        }
    },

    methods: {
        goToOrderDetails: function() {
            return this.$router.push({
                name: 'order_details',
                params: {
                    id: this.order.transaction.id
                }
            });
        }
    },

    created() {
        orderService
            .getOrder(this.$route.params.id)
            .then((order) => {
                this.order = order;
                this.loading = false;
                this.orderExists = true;
            })
            .catch(() => {
                this.orderExists = false;
            })
            .finally(() => {
                this.loading = false;
            });
    },

    metaInfo() {
        return {
            title: this.$t('Thanks.'),
            meta: [
                { vmid: 'description', name: 'description', content: `Thanks for your order from Gmnst` }
            ]
        }
    }
}
</script>


<template>
    <default-layout>
        <section class="container">
            <div class="container-skinny">

                <div v-if="!orderExists" class="tac mtl">
                    {{ $t('Oops we could not find the order you are looking for.') }}
                </div>

                <div v-else>
                    <div class="fs30 tac mtl fwb">
                        <i class="fa fa-hand-peace-o vab mrs"></i>
                        {{ $t('Thanks.') }}
                    </div>

                    <div v-loading="loading">
                        <div class="mtl grayCell">
                            <div class="colorGreen">
                                {{ $t('An email confirmation was sent to:' )}}
                                <div class="fwb">
                                    <i class="fa fa-envelope-o vab mrs" aria-hidden="true"></i>
                                    {{ order.shoppingCart.shipping_email }}
                                </div>
                            </div>

                            <div class="fs12 mts">({{ $t('Please allow a few minutes for email delivery.' )}})</div>
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
                                    <div class="displayTableCell fwb pbs">{{ $n(order.transaction.amount, 'currency') }}</div>
                                </div>

                                <div class="displayTableRow">
                                    <div class="displayTableCell prm pbs">{{ $t('Payment method') }}:</div>
                                    <div class="displayTableCell fwb pbs">
                                        <payment-type-display :card-type="cardType"
                                                            :last-four="order.transaction.payment.last4"
                                                            :payer-email="order.transaction.payment.payerEmail"></payment-type-display>
                                    </div>
                                </div>

                                <div class="displayTableRow">
                                    <div class="displayTableCell prm pbs">{{ $t('Order') }}:</div>
                                    <div class="displayTableCell fwb pbs">
                                        <a v-if="order.id" @click="goToOrderDetails()">{{ order.transaction.id }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </default-layout>
</template>

<style lang="scss" scoped>
    @import "../../assets/css/components/_variables.scss";
    @import "../../assets/css/components/_mixins.scss";

    .grayCell {
        padding: 10px;
        margin: 20px auto 0 auto;
        display: table;
        font-size: 14px;
        @include rounded();
        background-color: $bgGrayZebra;
        width: 100%;
        text-align: center;
    }
</style>