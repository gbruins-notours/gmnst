<template>
    <div class="mbm">
        <article class="media">
            <figure class="media-left">
                <p class="image is-128x128">
                    <img v-bind:src="productPic">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <strong>{{ item.product.title }}</strong>
                </div>

                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <small>Size:</small>&nbsp;
                            TODO
                        </div>
                    </div>
                </div>

                <div><a @click="removeItem(item.id)">{{ $t('Delete') }}</a></div>
            </div>

            <div class="media-right">
                <div class="displayTableRow">
                    <div class="displayTableCell prm">
                        <product-price :product="item.product"></product-price>
                    </div>

                    <!-- Quantity -->
                    <div class="displayTableCell">
                        <number-select :min="1"
                                       :max="item.product.inventory_count"
                                       :initialize="item.qty"
                                       v-on:number_select_changed="function(val) { updateCartItemQuantity(item.id, val) }"></number-select>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
    import isObject from 'lodash.isobject'
    import { mapActions } from 'vuex'
    import ProductPrice from '../product/ProductPrice.vue'
    import NumberSelect from '../../components/NumberSelect.vue'

    export default {
        props: ['item'],

        components: {
            ProductPrice,
            NumberSelect
        },

        computed: {
            productPic: function() {
                if (this.item.product.featured_pic) {
                    return '/static/images/product/' + this.item.product.featured_pic;
                }
                return;
            }
        },

        methods: {
            ...mapActions([
                'CART_ITEM_SET_QTY',
                'CART_ITEM_DELETE'
            ]),

            updateCartItemQuantity(id, qty) {
                this.CART_ITEM_SET_QTY({
                    id,
                    qty
                })
            },

            removeItem(id) {
                this.CART_ITEM_DELETE({
                    id
                })
            },

            goToDetails() {
                if (this.product.seo_uri) {
                    this.$router.push(`/item/${this.product.seo_uri}`);
                }
            }
        }
    }
</script>
