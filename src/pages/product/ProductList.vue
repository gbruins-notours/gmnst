<template>
    <section>
        <div class="columns section">
            <div class="column is-8">
                <div class="title">Gallery</div>
            </div>

            <div class="column is-4 has-text-right">
                <a class="button is-active"><i class="fa fa-th title is-5"></i></a>
                <a class="button"><i class="fa fa-align-justify title is-5"></i></a>
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
import forEach from 'lodash.foreach'
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
            products: {}
        }
    },

    methods: {
        ...mapGetters([
            'appInfo'
        ]),

        getIdByProductType(type) {
            let info = this.appInfo();
            let id = 0;

            forEach(info.product.type, (obj, key) => {
                if (key === type) {
                    id = obj.id
                }
            });

            return id;
        },

        fetchProducts(productTypeId) {
            let typeId = this.getIdByProductType(productTypeId);
            let params = {
                where: ['is_available', '=', false],
                andWhere: [
                    ['product_type_id', '=', parseInt(typeId)],
                    ['inventory_count', '>', 0]
                ],
                orderBy: 'updated_at',
                orderDir: 'DESC'
            };

            api.getProducts(params).then((products) => {
                console.log('PRODUCTS', products);
                this.products = products;
            });
        }
    },

    created () {
        this.fetchProducts(this.$route.params.id)
    },

    watch: {
        '$route' (to, from) {
            this.fetchProducts(to.params.id);
        }
    }
}
</script>

<style>
</style>

