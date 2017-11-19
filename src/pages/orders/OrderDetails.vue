<script>
import Vue from 'vue'
import PageHeader from '../../components/PageHeader'
import PaymentTypeDisplay from '../../components/PaymentTypeDisplay'
import ProductPrice from '../../components/product/ProductPrice'
import CartTotalsTable from '../../components/cart/CartTotalsTable'
import orderMixin from './order_mixin'
import OrderService from './order_service.js'
import ProductService from '../product/product_service.js'
import ShoppingCartService from '../cart/shopping_cart_service.js'

let orderService = new OrderService();
let productService = new ProductService();
let shoppingCartService = new ShoppingCartService();

export default {
    components: {
        PageHeader,
        PaymentTypeDisplay,
        ProductPrice,
        CartTotalsTable
    },

    mixins: [
        orderMixin
    ],

    data: function() {
        return {
            productService: productService
        }
    },

    methods: {
        goToDetails(seo_uri) {
            this.$router.push({
                name: 'product_detail',
                params: { itemId: seo_uri }
            });
        },
    },

    created() {
        orderService.getOrder(this.$route.params.id, true).then((order) => {
            this.order = order;
        });
    }
}
</script>

<template>
    <section class="container">
        <page-header :title="$t('Order Details')"></page-header>

        <div class="pal">
            <div class="mbl">
                <div class="displayTableRow">
                    <div class="displayTableCell prm">{{ $t('Ordered on') }}:</div>
                    <div class="displayTableCell">{{ order.created }}</div>
                </div>

                <div class="displayTableRow">
                    <div class="displayTableCell prm">{{ $t('Order') }}:</div>
                    <div class="displayTableCell">{{ order.transaction.id }}</div>
                </div>
            </div>

            <div>
                <div class="mbl mrxl inlineBlock vat">
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

                <div class="mbl mrxl inlineBlock vat">
                    <div class="fwb">{{ $t('Payment method') }}:</div>
                    <div>
                        <payment-type-display :card-type="cardType" 
                                              :last-four="order.transaction.payment.last4"
                                              :payer-email="order.transaction.payment.payerEmail"></payment-type-display>
                    </div>
                </div>

                <div class="mbl inlineBlock vat">
                    <div class="fwb">{{ $t('Order summary') }}:</div>
                    <div>
                        <cart-totals-table :cart="order.shoppingCart"
                                        :show-shipping-cost="true"
                                        :show-sales-tax="true"
                                        label-class="tal"></cart-totals-table>
                    </div>
                </div>
            </div>

            <div>
                <article v-for="item in order.shoppingCart.cart_items" 
                        :key="item.id" 
                        class="cartItem"
                        :id="'cartItem' + item.id">
                    <div class="cartItemPic">
                        <figure class="image is-128x128">
                            <img v-bind:src="productService.featuredProductPic(item.product)">
                        </figure>
                    </div>

                    <div class="cartItemInfo">
                        <div class="cartItemInfoContent">
                            <div class="cartItemMain">
                                <a class="itemTitle" @click="goToDetails(item.product.seo_uri)">{{ item.product.title }}</a>
                            </div>

                            <!-- Variants -->
                            <div class="cartItemCol">
                                <div v-if="item.variants && item.variants.size">
                                    <label class="itemLabel">{{ $t('Size') }}:</label>
                                    <div class="itemVal">{{ $t(item.variants.size) }}</div>
                                </div>
                            </div>
                            
                            <!-- Price -->
                            <div class="cartItemCol">
                                <label class="itemLabel">{{ $t('Price' )}}:</label>
                                <div class="itemVal"><product-price :product="item.product"></product-price></div>
                            </div>

                            <!-- Quantity -->
                            <div class="cartItemCol">
                                <label class="itemLabel">{{ $t('Quantity' )}}:</label>
                                <div>{{ item.qty }}</div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

        </div>
    </section>
</template>