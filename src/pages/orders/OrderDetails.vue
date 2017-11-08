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
                    <div class="displayTableCell">{{ order.transaction_id }}</div>
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
                        <payment-type-display :card-type="order.creditCard.cardType" :last-four="order.creditCard.last4"></payment-type-display>
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
                            <img v-bind:src="cartService.productPic(item)">
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

<script>
    import Vue from 'vue'
    import api from '../../util/api'
    import checkoutService from '../../util/checkoutService'
    import cartService from '../../util/cartService'
    import PageHeader from '../../components/PageHeader'
    import PaymentTypeDisplay from '../../components/PaymentTypeDisplay'
    import ProductPrice from '../../components/product/ProductPrice'
    import CartTotalsTable from '../../components/cart/CartTotalsTable'

    export default {

        components: {
            PageHeader,
            PaymentTypeDisplay,
            ProductPrice,
            CartTotalsTable
        },

        computed: {
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
                },
                cartService: cartService
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
            api.getOrderDetails(this.$route.params.id)
                .then((order) => {
                    this.order = order;
                });
        }

    }
</script>

<style lang="scss">

</style>
