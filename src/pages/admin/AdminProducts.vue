<script>
import { mapGetters } from 'vuex';
import forEach from 'lodash.foreach'
import AdminLayout from '@/layouts/AdminLayout'
import ProductService from '@/pages/product/product_service.js'
import TableHeaderLink from '@/components/TableHeaderLink'

let productService = new ProductService();


export default{
    components: {
        AdminLayout,
        TableHeaderLink
    },

    data() {
        return {
            products: [],
            sortData: {
                orderBy: 'updated_at',
                orderDir: 'DESC'
            }
        }
    },

    computed: {
        ...mapGetters({
            productSubTypes: 'product/subTypes'
        })
    },

    methods: {
        getProductPic(prod) {
            return productService.featuredProductPic(prod);
        },

        fetchProducts() {
            productService
                .getProducts({
                    // where: ['is_available', '=', true],
                    // whereRaw: ['sub_type & ? > 0', [productTypeId]],
                    // andWhere: [
                    //     ['inventory_count', '>', 0]
                    // ],
                    ...this.sortData
                })
                .then((products) => {
                    this.products = products;
                    // console.log("products", this.products)
                });
        },

        getProductTypeName(id) {
            let name = null;
            Object.keys(this.productSubTypes).forEach((key) => {
                if(this.productSubTypes[key] === id) {
                    name = this.$tc(key, 2);
                }
            });
            return name;
        },

        sort(sortData) {
            this.sortData = sortData;
            this.fetchProducts();
        }
    },

    created: function() {
        this.fetchProducts();
    }
}
</script>


<template>
    <admin-layout>
        <div v-cloak>
       
            <table v-show="products.length" class="table">
                <thead>
                    <tr>
                        <th>Featured Image</th>
                        <th>
                            <table-header-link
                                    attribute="is_available" 
                                    :sort-data="sortData"
                                    @change="(obj) => { sort(obj) }">Available</table-header-link>
                        </th>
                        <th>
                            <table-header-link
                                    attribute="sub_type" 
                                    :sort-data="sortData"
                                    @change="(obj) => { sort(obj) }">Type</table-header-link>
                        </th>
                        <th>
                            <table-header-link
                                    attribute="title" 
                                    :sort-data="sortData"
                                    @change="(obj) => { sort(obj) }">Title</table-header-link>
                        </th>
                        <th class="hide_medium_down">Description Short</th>
                        <th>Display Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id">
                        <!-- featured image -->
                        <td><img :src="getProductPic(product) " alt="Image" class="prodPic"></td>

                        <!-- is available -->
                        <td>
                            <span v-bind:class="{'colorGreen':product.is_available, 'colorRed':!product.is_available}">
                                {{ product.is_available ? 'Yes' : 'No '}}
                            </span>
                        </td>

                        <!-- product sub-type -->
                        <td>{{ getProductTypeName(product.sub_type) }}</td>

                        <!-- product title -->
                        <td>{{ product.title }}</td>

                        <!-- desc short -->
                        <td class="hide_medium_down">{{ product.description_short }}</td>

                        <!-- display price -->
                        <td>{{ product.display_price }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-show="!products.length">{{ $t('No results') }}</div>

        </div>
    </admin-layout>
</template>


<style lang="scss">
    @import "../../assets/css/components/_table.scss";

    .prodPic {
        width: 70px;
    }
</style>