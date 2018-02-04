<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Notification, Dialog, Button, Input, InputNumber, Checkbox, Select, Option } from 'element-ui'
import TreeView from 'vue-json-tree-view'
import VueYouTubeEmbed from 'vue-youtube-embed'
import AdminLayout from '@/layouts/AdminLayout'
import FormRow from '@/components/FormRow'
import ProductSizeDetails from '@/components/product/ProductSizeDetails'
import BitwiseMultiSelect from '@/components/BitwiseMultiSelect'
import ProductService from '@/pages/product/product_service.js'

let productService = new ProductService();

Vue.prototype.$notify = Notification;
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
        ProductSizeDetails,
        BitwiseMultiSelect
    },

    data() {
        return {
            product: {},
            productInfo: {},
            productPics: [],
            productPicPath: productService.getProductPicPath(),
            modalIsActive: false,
            videoId: null,
            videoPlayer: null,
            picModalIsActive: false,
            picForModal: {},
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

        goToProductList(id) {
            this.$router.push({ 
                name: 'adminProductList'
            });
        },

        playVideo(url) {
            let id = this.$youtube.getIdFromURL(url);
            if(id) {
                this.videoId = id;
                this.modalIsActive = true;
            }
            else {
                this.modalIsActive = false;
            }
        },

        modalClosed() {
            if(this.videoPlayer) {
                this.videoPlayer.stopVideo();
            }
        },

        videoPlaying(player) {
            this.videoPlayer = player;
        },

        openPicQuickView(pic) {
            this.picForModal = pic;
            this.picModalIsActive = true;
        },

        editProduct(product) {
            productService
                .update(product)
                .then((product) => {
                    if(!product) {
                        throw new Error(this.$t('Product not found'));
                    }

                    this.$notify({
                        type: 'success',
                        title: 'Product updated successfully',
                        message: product.title,
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
        productService
            .getProductById(this.$route.params.id)
            .then((product) => {
                if(!product) {
                    throw new Error(this.$t('Product not found'));
                }

                this.product = product;
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

        productService
            .getProductInfo()
            .then((productInfo) => {
                if(!productInfo) {
                    throw new Error(this.$t('Product info not found'));
                }

                this.productInfo = productInfo;
                console.log("PROD INFO", productInfo)
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
                <div class="g-spec-label">
                    Sizes <span v-if="product.sizes">({{ product.sizes.length }})</span>
                </div>
                <div class="g-spec-content">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Size</th>
                                <th>Sort order</th>
                                <th>Is visible</th>
                                <th>Cost</th>
                                <th>Base price</th>
                                <th>Sale price</th>
                                <th>Is on sale</th>
                                <th>Inventory count</th>
                            </tr>
                        </thead>  
                        <tbody>
                            <tr v-for="size in product.sizes">
                                <td>{{ $t(size.size) }}</td>
                                <td class="tac">{{ size.sort }}</td>
                                <td class="tac">{{ size.is_visible }}</td>
                                <td class="tac">{{ size.cost }}</td>
                                <td class="tac">{{ size.base_price }}</td>
                                <td class="tac">{{ size.sale_price }}</td>
                                <td class="tac">{{ size.is_on_sale }}</td>
                                <td class="tac">{{ size.inventory_count }}</td>
                            </tr>
                        </tbody>      
                    </table>
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
                            <table class="table">
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
                                    <tr v-for="pic in product.pics">
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
                            <el-select v-model="product.type">
                                <el-option
                                    v-for="(val, key) in productInfo.types"
                                    :key="key"
                                    :label="$t(key)"
                                    :value="val">
                                </el-option>
                            </el-select>
                        </form-row>

                        <!-- sub_type -->
                        <form-row label="Product sub-type:">
                            <el-select v-model="product.sub_type">
                                <el-option
                                    v-for="(val, key) in productInfo.subTypes"
                                    :key="key"
                                    :label="$tc(key, 2)"
                                    :value="val">
                                </el-option>
                            </el-select>
                        </form-row>

                        <!-- gender -->
                        <form-row label="Gender type:">
                            TODO: the values are bitwise, so this plain select doesnt work
                            {{ productInfo.genders }}
                            <bitwise-multi-select :options="productInfo.genders"></bitwise-multi-select>
                            <!-- <el-select v-model="product.gender">
                                <el-option
                                    v-for="(val, key) in productInfo.genders"
                                    :key="key"
                                    :label="$t(key)"
                                    :value="val">
                                </el-option>
                            </el-select> -->
                        </form-row>

                    </div>
                </div>
            </div>

            <div class="g-spec">
                <div class="g-spec-label"></div>
                <div class="g-spec-content">
                    <el-button 
                        type="primary"
                        @click="editProduct(product)">SUBMIT</el-button>
                </div>
            </div>
        </div>


        <el-dialog title="Product video"
                   :visible.sync="modalIsActive"
                   :modal-append-to-body="false"
                   @close="modalClosed">
            <youtube 
                :video-id="videoId" 
                :player-vars="{ autoplay: 1 }"
                @playing="videoPlaying"></youtube>
        </el-dialog>

        <!-- product pic dialog -->
        <el-dialog :title="$t(picForModal.file_name)"
                   :visible.sync="picModalIsActive"
                   :modal-append-to-body="false"
                   width="95%">
            <div class="tac">
                <img :src="productPicPath + picForModal.file_name" />
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