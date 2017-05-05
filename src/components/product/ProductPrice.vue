<template>
    <span>${{ price }}</span>
</template>

<script>
    import isObject from 'lodash.isobject'

    export default {
        props: {
            product: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                price: 0
            }
        },

        methods: {
            getPrice(product) {
                if (isObject(product)) {
                    if (product.is_on_sale && product.sale_price) {
                        return parseFloat(product.sale_price);
                    }
                    else if (product.base_price) {
                        return parseFloat(product.base_price);
                    }
                }

                return 0;
            }
        },

        watch: {
            product (val) {
                this.price = this.getPrice(val);
            }
        }
    }
</script>
