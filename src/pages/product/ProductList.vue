<script>
import DefaultLayout from '@/layouts/DefaultLayout'
import ProductCard from '@/components/product/ProductCard'
import ProductService from '@/pages/product/product_service.js'

let productService = new ProductService();

export default {
    props: ['id'],

    components: {
        DefaultLayout,
        ProductCard
    },

    data() {
        return {
            products: {},
            productSubType: 'fff'
        }
    },

    computed: {
        productTypeName() {
            return this.$tc(this.productSubType, 2);
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
                this.productSubType = productSubType;
            }
        }
    },

    metaInfo() {
        return {
            title: this.productTypeName,
            meta: [
                { vmid: 'description', name: 'description', content: `${this.productSubType} by Gmnst` }
            ]
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
    <default-layout>
        <section class="section container is-fluid">
            <div class="columns is-multiline">
                <div class="column is-4" v-for="product in products" :key="product.id">
                    <span v-on:click="goToDetails(product)" class="cursorPointer">
                        <product-card :product="product"></product-card>
                    </span>
                </div>
            </div>
        </section>
    </default-layout>
</template>