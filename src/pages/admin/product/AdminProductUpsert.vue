<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Notification, MessageBox, Dialog, Button, Input, InputNumber, Checkbox, Select, Option } from 'element-ui'
import TreeView from 'vue-json-tree-view'
import VueYouTubeEmbed from 'vue-youtube-embed'
import forEach from 'lodash.foreach'
import AdminLayout from '@/layouts/AdminLayout'
import FormRow from '@/components/FormRow'
import ProductSizeAdmin from '@/components/product/admin/ProductSizeAdmin'
import BitwiseMultiSelect from '@/components/BitwiseMultiSelect'
import ProductService from '@/pages/product/ProductService.js'

let productService = new ProductService();

Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.use(Button);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(TreeView);
Vue.use(VueYouTubeEmbed)

let currentNotification = null;


function showNotification(Notification) {
    if(currentNotification) {
        currentNotification.close();
    }
    currentNotification = Notification
}


export default{
    components: {
        AdminLayout,
        FormRow,
        ProductSizeAdmin,
        BitwiseMultiSelect
    },

    data() {
        return {
            product: {},
            productInfo: {},
            productPics: [],
            productPicPath: productService.getProductPicPath(),
            videoPlayerModal: {
                isActive: false,
                videoId: null,
                player: null,
            },
            pictureViewModal: {
                pic: {},
                isActive: false
            },
            pictureUpsertModal: {
                isActive: false,
            }
        }
    },

    computed: {
        ...mapGetters({
            productSubTypes: 'product/subTypes'
        }),

        typeSelectOptions() {
            let opts = {};
            let self = this;
            forEach(this.productInfo.types, function(val, key) {
                opts[self.$t(key)] = val;
            });
            return opts;
        },

        subTypeSelectOptions() {
            let opts = {};
            let self = this;
            forEach(this.productInfo.subTypes, function(val, key) {
                opts[self.$tc(key, 2)] = val;
            });
            return opts;
        },

        genderSelectOptions() {
            let opts = {};
            let self = this;
            forEach(this.productInfo.genders, function(val, key) {
                opts[self.$t(key)] = val;
            });
            return opts;
        }
    },

    methods: {
        getProduct() {
            return productService
                .getProductById(this.$route.params.id, { viewAllRelated: true })
                .then((product) => {
                    if(!product) {
                        throw new Error(this.$t('Product not found'));
                    }

                    return product;
                })
                .catch((e) => {
                    showNotification(
                        this.$notify({
                            type: 'error',
                            title: e.message,
                            duration: 0
                        })
                    )
                });
        },

        getProductPic(prod) {
            return productService.featuredProductPic(prod);
        },

        goToProductList(id) {
            this.$router.push({
                name: 'adminProductList'
            });
        },

        playVideo(url) {
            let id = this.$youtube.getIdFromURL(url);
            if(id) {
                this.videoPlayerModal.videoId = id;
                this.videoPlayerModal.isActive = true;
            }
            else {
                this.videoPlayerModal.isActive = false;
            }
        },

        modalClosed() {
            if(this.videoPlayerModal.player) {
                this.videoPlayerModal.player.stopVideo();
            }
        },

        videoPlaying(player) {
            this.videoPlayerModal.player = player;
        },

        openPicQuickView(pic) {
            this.pictureViewModal.pic = pic;
            this.pictureViewModal.isActive = true;
        },

        upsertProduct(product) {
            productService
                .upsert(product)
                .then((p) => {
                    if(!p) {
                        throw new Error(this.$t('Error updating product'));
                    }

                    let title = 'Product added successfully';
                    if(product.id) {
                        title = 'Product updated successfully';
                    }

                    this.$notify({
                        type: 'success',
                        title,
                        message: p.title,
                        duration: 3000
                    });

                    this.goToProductList();
                })
                .catch((e) => {
                    showNotification(
                        this.$notify({
                            type: 'error',
                            title: e.message,
                            duration: 0
                        })
                    )
                });
        }
    },

    created() {
        if(this.$route.params.id) {
            this.getProduct().then((product) => {
                this.product = product;
            });
        }

        productService
            .getProductInfo()
            .then((productInfo) => {
                if(!productInfo) {
                    throw new Error(this.$t('Product info not found'));
                }

                this.productInfo = productInfo;
            })
            .catch((e) => {
                showNotification(
                    this.$notify({
                        type: 'error',
                        title: e.message,
                        duration: 0
                    })
                )
            });
    }
}
</script>


<template>
    <admin-layout>
        <div v-cloak>

            <div class="g-spec">
                <div class="g-spec-label">General Info</div>
                <div class="g-spec-content">
                    <div class="formContainer">

                        <!-- is_available -->
                        <form-row label="Available:">
                            <el-checkbox v-model="product.is_available"></el-checkbox>
                        </form-row>

                        <!-- title -->
                        <form-row label="Title:">
                            <el-input v-model="product.title"></el-input>
                        </form-row>

                        <!-- description_short -->
                        <form-row label="Short Description:">
                            <el-input type="textarea" :rows="2" v-model="product.description_short"></el-input>
                        </form-row>

                        <!-- description_long -->
                        <form-row label="Long Description:">
                            <el-input type="textarea" :rows="3" v-model="product.description_long"></el-input>
                        </form-row>

                        <!-- seo_uri -->
                        <form-row label="SEO URI:">
                            <el-input v-model="product.seo_uri"></el-input>
                        </form-row>

                        <!-- weight_oz -->
                        <form-row label="Weight (oz):">
                            <el-input-number v-model="product.weight_oz" controls-position="right" :step=".01"></el-input-number>
                        </form-row>

                        <!-- tax_code -->
                        <form-row label="Tax code:">
                            <el-input-number v-model="product.tax_code" controls-position="right" :step="1"></el-input-number>
                        </form-row>

                        <!-- sku -->
                        <form-row label="SKU:">
                            <el-input v-model="product.sku"></el-input>
                        </form-row>

                    </div>
                </div>
            </div>

            <div class="g-spec">
                <div class="g-spec-label">Pricing</div>
                <div class="g-spec-content">
                    <div class="formContainer">

                        <!-- cost -->
                        <form-row label="Cost:">
                            <el-input-number v-model="product.cost" controls-position="right" :step=".01"></el-input-number>
                        </form-row>

                        <!-- base_price -->
                        <form-row label="Base price:">
                            <el-input-number v-model="product.base_price" controls-position="right" :step=".01"></el-input-number>
                        </form-row>

                        <!-- sale_price -->
                        <form-row label="Sale price:">
                            <el-input-number v-model="product.sale_price" controls-position="right" :step=".01"></el-input-number>
                        </form-row>

                        <!-- sale_price -->
                        <form-row label="On sale:">
                            <el-checkbox v-model="product.is_on_sale"></el-checkbox>
                        </form-row>

                    </div>
                </div>
            </div>

            <div class="g-spec">
                <div class="g-spec-label">Sizes</div>
                <div class="g-spec-content">
                    <product-size-admin v-if="product.id" :product-id="product.id"></product-size-admin>
                </div>
            </div>

            <div class="g-spec">
                <div class="g-spec-label">Media</div>
                <div class="g-spec-content">
                    <!-- featured_pic -->
                    <form-row label="Featured Picture:">
                        <el-input v-model="product.featured_pic"></el-input>
                    </form-row>

                    <!-- video_url -->
                    <form-row label="Video URL:">
                        <el-input v-model="product.video_url">
                            <el-button
                                slot="append"
                                v-if="product.video_url"
                                @click="playVideo(product.video_url)"><i class="fa fa-play"></i></el-button>
                        </el-input>
                    </form-row>

                    <!-- pictures -->
                    <form-row label="Pictures:">
                        <div class="tar mbm">
                            <el-button type="primary"
                                    @click="openPicUpsertModal()">ADD SIZE</el-button>
                        </div>

                        <div v-if="!product.pics || !product.pics.length" class="colorGrayLighter">none</div>
                        <table v-else class="table widthAll">
                            <thead>
                                <tr>
                                    <th>Pic</th>
                                    <th>File name</th>
                                    <th>Sort order</th>
                                    <th>Visible</th>
                                    <th>Featured?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="pic in product.pics" :key="pic.id">
                                    <td>
                                        <a @click="openPicQuickView(pic)"><img :src="productPicPath + pic.file_name" class="width50"></a>
                                    </td>
                                    <td>{{ pic.file_name }}</td>
                                    <td class="tac">{{ pic.sort_order }}</td>
                                    <td>{{ pic.is_visible }}</td>
                                    <td><span class="colorGreen" v-if="product.featured_pic === pic.file_name">yes</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </form-row>
                </div>
            </div>

            <div class="g-spec">
                <div class="g-spec-label">Inventory</div>
                <div class="g-spec-content">
                    <div class="formContainer">

                        <!-- inventory_count -->
                        <form-row label="Inventory count:">
                            <el-input-number v-model="product.inventory_count" controls-position="right" :step="1"></el-input-number>
                        </form-row>

                        <!-- hide_if_out_of_stock -->
                        <form-row label="Hide if out of stock:">
                            <el-checkbox v-model="product.hide_if_out_of_stock"></el-checkbox>
                        </form-row>

                    </div>
                </div>
            </div>

            <div class="g-spec">
                <div class="g-spec-label">Categories</div>
                <div class="g-spec-content">
                    <div class="formContainer">

                        <!-- type -->
                        <form-row label="Product type:">
                            <bitwise-multi-select
                                :options="typeSelectOptions"
                                :init="product.type"
                                @changed="val => product.type = val"></bitwise-multi-select>
                        </form-row>

                        <!-- sub_type -->
                        <form-row label="Product sub-type:">
                            <bitwise-multi-select
                                :options="subTypeSelectOptions"
                                :init="product.sub_type"
                                @changed="val => product.sub_type = val"></bitwise-multi-select>
                        </form-row>

                        <!-- gender -->
                        <form-row label="Gender type:">
                            <bitwise-multi-select
                                :options="genderSelectOptions"
                                :init="product.gender"
                                @changed="val => product.gender = val"></bitwise-multi-select>
                        </form-row>

                    </div>
                </div>
            </div>

            <div class="g-spec">
                <div class="g-spec-label"></div>
                <div class="g-spec-content">
                    <el-button
                        type="primary"
                        @click="upsertProduct(product)">SUBMIT</el-button>

                    <el-button @click="goToProductList">CANCEL</el-button>
                </div>
            </div>
        </div>


        <el-dialog title="Product video"
                   :visible.sync="videoPlayerModal.isActive"
                   :modal-append-to-body="false"
                   @close="modalClosed">
            <youtube
                :video-id="videoPlayerModal.videoId"
                :player-vars="{ autoplay: 1 }"
                @playing="videoPlaying"></youtube>
        </el-dialog>

        <!-- product pic dialog -->
        <el-dialog :title="pictureViewModal.pic.file_name"
                   :visible.sync="pictureViewModal.isActive"
                   :modal-append-to-body="false"
                   width="95%">
            <div class="tac">
                <img :src="productPicPath + pictureViewModal.pic.file_name" />
            </div>
        </el-dialog>

    </admin-layout>
</template>


<style lang="scss">
    @import "../../../assets/css/components/_table.scss";

    .prodPic {
        width: 400px;
    }

    .formContainer {
        width: 500px;

        .formRow > label {
            white-space: nowrap;
        }

        .formRow > span {
            width: 100%;
        }
    }
</style>
