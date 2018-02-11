<script>
import Vue from 'vue'
import { mapGetters } from 'vuex';
import { Dialog, Button } from 'element-ui'
import forEach from 'lodash.foreach'
import AdminLayout from '@/layouts/AdminLayout'
import ProductService from '@/pages/product/ProductService.js'
import TableHeaderLink from '@/components/TableHeaderLink'
import ProductDetailsJsonView from '@/components/product/ProductDetailsJsonView'

let productService = new ProductService();

Vue.use(Dialog)
Vue.use(Button)

export default{
    components: {
        AdminLayout,
        TableHeaderLink,
        ProductDetailsJsonView
    },

    data() {
        return {
            products: [],
            quickViewProduct: null,
            modalIsActive: false,
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
        },

        goToDetails(id) {
            this.$router.push({ 
                name: 'adminProductDetails',
                params: { id } 
            });
        },

        goToEdit(id) {
            this.$router.push({ 
                name: 'adminProductUpsert',
                params: { id } 
            });
        },

        openQuickView(product) {
            this.quickViewProduct = product;
            this.modalIsActive = true;
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
                                    @change="sort">Available</table-header-link>
                        </th>
                        <th>
                            <table-header-link
                                    attribute="sub_type" 
                                    :sort-data="sortData"
                                    @change="sort">Type</table-header-link>
                        </th>
                        <th>
                            <table-header-link
                                    attribute="title" 
                                    :sort-data="sortData"
                                    @change="sort">Title</table-header-link>
                        </th>
                        <th>Display Price</th>
                        <th class="hide_medium_down">
                            <table-header-link
                                    attribute="updated_at" 
                                    :sort-data="sortData"
                                    @change="sort">Updated</table-header-link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id">
                        <!-- featured image -->
                        <td><img :src="getProductPic(product) " alt="Image" class="prodPicSmall"></td>

                        <!-- is available -->
                        <td>
                            <span v-bind:class="{'colorGreen':product.is_available, 'colorRed':!product.is_available}">
                                {{ product.is_available ? 'Yes' : 'No '}}
                            </span>
                        </td>

                        <!-- product sub-type -->
                        <td>{{ getProductTypeName(product.sub_type) }}</td>

                        <!-- product title -->
                        <td>
                            <div>{{ product.title }}</div>

                            <div>
                                <el-button type="text" @click="openQuickView(product)">QUICK VIEW</el-button>
                            </div>

                            <div>
                                <el-button type="text" @click="goToEdit(product.id)">EDIT</el-button>
                            </div>
                        </td>

                        <!-- display price -->
                        <td>{{ product.display_price }}</td>

                        <!-- display price -->
                        <td class="hide_medium_down">{{ product.updated_at | format8601 }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-show="!products.length">{{ $t('No results') }}</div>

            <el-dialog :title="quickViewProduct ? quickViewProduct.title : null"
                       :visible.sync="modalIsActive"
                       :modal-append-to-body="false"
                       width="95%">
                <product-details-json-view :product="quickViewProduct"></product-details-json-view>
            </el-dialog>

        </div>
    </admin-layout>
</template>


<style lang="scss">
    @import "../../../assets/css/components/_table.scss";

    .prodPicSmall {
        width: 70px;
    }
</style>