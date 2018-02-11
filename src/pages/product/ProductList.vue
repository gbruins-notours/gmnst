<script>
import { mapGetters } from 'vuex'
import DefaultLayout from '@/layouts/DefaultLayout'
import ProductCard from '@/components/product/ProductCard'
import ProductService from '@/pages/product/ProductService.js'

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
            productSubType: null
        }
    },

    computed: {
        ...mapGetters({
            productSubTypes: 'product/subTypes',
            productSeoUri: 'product/seoUri',
        }),

        productTypeName() {
            return this.$tc(this.productSubType, 2);
        }
    },

    methods: {
        getIdByProductType(type) {
            let id = 0;
            let subtype = null;

            Object.keys(this.productSeoUri).forEach((key) => {
                if (this.productSeoUri[key] === type 
                        && this.productSubTypes.hasOwnProperty(key)) {
                    id = this.productSubTypes[key];
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