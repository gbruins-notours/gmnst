<template>
    <section>
        <div class="container">
            <div class="pam">
               <div class="inlineBlock mrl mbm">
                   <div class="title nowrap">{{ $t('Shopping Cart') }}</div>
               </div>

               <div class="inlineBlock">
                   <el-button type="warning" @click="goToCheckout" class="colorBlack">{{ $t('Proceed to checkout') }}</el-button>
               </div>

                <div v-if="added_cart_item">
                    {{ $t('Added to Cart') }}:
                    <div>TODO</div>
                </div>

                <cart-items :allow-delete="true"></cart-items>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    import isObject from 'lodash.isobject'
    import CartItems from '../../components/cart/CartItems'

    export default {
        props: ['id'],

        components: {
            CartItems
        },

        data: function() {
            return {
                added_cart_item: null
            }
        },

        methods: {
            goToCheckout() {
                this.$router.push({ name: 'checkout' });
            },
        },

        created() {
            if(this.$route.params.id) {
                console.log("CART", this.cart);

                if(isObject(this.cart) && Array.isArray(this.cart.cart_items)) {
                    this.cart.cart_items.forEach((item) => {
                        if(item.product_id === this.$route.params.id) {
                            this.added_cart_item = item;
                        }
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
</style>
