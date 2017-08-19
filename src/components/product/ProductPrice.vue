<template>
    <span>{{ $n(price, 'currency') }}</span>
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

        computed: {
            price: function() {
                if (isObject(this.product)) {
                    if (this.product.is_on_sale && this.product.sale_price) {
                        return this.product.sale_price;
                    }
                    else if (this.product.base_price) {
                        return this.product.base_price;
                    }
                }

                return 0;
            }
        }
    }
</script>
