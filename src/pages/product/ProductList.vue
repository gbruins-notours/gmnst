<script>
import ProductCard from '../../components/product/ProductCard'
import ProductService from './product_service.js'

let productService = new ProductService();

export default {
    props: ['id'],

    components: {
        ProductCard
    },

    data() {
        return {
            products: {},
            pageTitle: null
        }
    },

    methods: {
        getIdByProductType(type) {
            let info = this.$store.state.app.productInfo;
            let id = 0;
            let subtype = null;

            Object.keys(info.seoUri).forEach((key) => {
                if (info.seoUri[key] === type && info.subTypes.hasOwnProperty(key)) {
                    id = info.subTypes[key];
                    subtype = key;
                }
            });

            return {
                productTypeId: id,
                productSubType: subtype
            };
        },

        fetchProducts(productTypeId) {
            productService
                .getProducts({
                    where: ['is_available', '=', true],
                    whereRaw: ['sub_type & ? > 0', [productTypeId]],
                    andWhere: [
                        ['inventory_count', '>', 0]
                    ],
                    orderBy: 'updated_at',
                    orderDir: 'DESC'
                })
                .then((products) => {
                    this.products = products;
                });
        },

        goToDetails(product) {
            if (product.seo_uri) {
                this.$router.push({
                    name: 'product_detail',
                    params: { itemId: product.seo_uri }
                });
            }
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

<template>
    <section class="section container is-fluid">
        <div class="columns is-multiline">
            <div class="column is-4" v-for="(product, index) in products" :key="product.id">
                <span v-on:click="goToDetails(product)" class="cursorPointer">
                    <product-card :product="product"></product-card>
                </span>
            </div>
        </div>
    </section>
</template>