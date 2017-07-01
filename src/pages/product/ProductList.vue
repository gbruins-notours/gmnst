<template>
    <section>
        <div class="columns pam">
            <div class="column is-8">
                <div class="title">{{ $tc(pageTitle, 2) }}</div>
            </div>
        </div>

        <div class="columns is-multiline">
            <div class="column is-4" v-for="(product, index) in products">
                <product-card :product="product"></product-card>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductCard from '../../components/product/ProductCard.vue'
import api from '../../util/api'

export default {
    props: ['id'],

    components: {
        'product-card': ProductCard
    },

    data() {
        return {
            products: {},
            pageTitle: null
        }
    },

    methods: {
        ...mapGetters([
            'appInfo'
        ]),

        getIdByProductType(type) {
            let info = this.appInfo();
            let id = 0;
            let subtype = null;

            Object.keys(info.seoUri).forEach((key) => {
                if (info.seoUri[key] === type && info.product.subTypes.hasOwnProperty(key)) {
                    id = info.product.subTypes[key];
                    subtype = key;
                }
            });

            return {
                productTypeId: id,
                productSubType: subtype
            };
        },

        fetchProducts(productTypeId) {
            let params = {
                where: ['is_available', '=', true],
                whereRaw: ['sub_type & ? > 0', [productTypeId]],
                andWhere: [
                    ['inventory_count', '>', 0]
                ],
                orderBy: 'updated_at',
                orderDir: 'DESC'
            };

            api.getProducts(params).then((products) => {
                this.products = products;
            });
        },

        init(productType) {
            let { productTypeId, productSubType } = this.getIdByProductType(productType);

            this.fetchProducts(productTypeId);

            if(productSubType) {
                this.pageTitle = productSubType;
            }
        }
    },

    beforeMount() {
        this.init(this.$route.params.id)
    },

    watch: {
        // React to route param changes:
        '$route' (to, from) {
            this.init(this.$route.params.id)
        }
    }
}
</script>

<style>
</style>

