<script>
import Vue from 'vue'
import { Notification, MessageBox, Upload, Dialog, Button, Input, InputNumber, Checkbox, Select, Option } from 'element-ui'
import forEach from 'lodash.foreach'
import Validations from 'vuelidate'    
import { required } from 'vuelidate/lib/validators'
import FormRow from '@/components/FormRow'
import ProductService from '@/pages/product/ProductService.js'
import ProductPictureService from '@/pages/product/ProductPictureService.js'

let productService = new ProductService();
let productPictureService = new ProductPictureService();

Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.use(Upload);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(Validations)

let currentNotification = null;
let productPicPath = productService.getProductPicPath();


function showNotification(Notification) {
    if(currentNotification) {
        currentNotification.close();
    }
    currentNotification = Notification
}


export default{
    components: {
        FormRow
    },

    props: {
        productId: {
            type: String,
            required: true
        },
    },

    data() {
        return {
            // productPicPath: productService.getProductPicPath(),
            product: {},
            picModal: {
                isActive: false,
                form: {},
                tempImage: null
            },
            picViewModal: {
                isActive: false,
                pic: {}
            }
        }
    },

    validations: function() {
        return {
            picModal: {
                form: {
                    is_visible: {},
                    sort_order: { required },
                    file_name: {} // no validation needed
                }
            }
        }
    },

    methods: {

        openPicEditModal(pic) {
            this.picModal.form = pic || {};
            this.picModal.isActive = true;
        },

        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
                return;
            }
            this.picModal.form.file = files[0];
            this.createTempImage(this.picModal.form.file);
            console.log("FILE UPLOAD", this.picModal.form.file)
        },

        createTempImage(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = (e) => {
                vm.picModal.tempImage = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        deleteTempImage() {
            this.picModal.tempImage = null;
        },

        deletePic(pic) {
            let picName = this.$t(pic.file_name);

            this.$confirm(`Remove this picture from the product? "${ picName }"`, 'Please confirm', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            })
            .then(() => {
                productPictureService
                    .delete(pic.id)
                    .then((size) => {
                        if(!size) {
                            throw new Error(this.$t('Product size not found'));
                        }

                        this.setProduct();

                        this.$emit('updated');

                        showNotification(
                            this.$notify({
                                type: 'success',
                                title: 'Picture deleted:',
                                message: pic.file_name,
                                duration: 3000
                            })
                        );
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
            })
            .catch(() => {
                // console.log("DELETE SIZE CANCELLED")         
            });
        },

        savePic(id) {
            let promise = null;
            let formData = new FormData();

            if(id) {
                //TODO
                // promise = productPictureService.update(pic);
            }
            else {
                this.picModal.form.product_id = this.product.id;

                forEach(this.picModal.form, (val, key) => {
                    formData.append(key, val);
                });

                // console.log("formData", formData.get('file'));
                // console.log("formData is_visible", formData.get('is_visible'));

                promise = productPictureService.create(formData);
            }

            promise.then((picJson) => {
                this.picModal.isActive = false;
                this.setProduct();

                this.$emit('updated');

                showNotification(
                    this.$notify({
                        type: 'success',
                        title: 'Picture saved:',
                        message: this.$t(picJson.file_name),
                        duration: 3000
                    })
                )
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

        setProduct() {
            return productService
                .getProductById(this.productId, { viewAllRelated: true })
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
        },

        openPicQuickView(pic) {
            this.picViewModal.pic = pic;
            this.picViewModal.isActive = true;
        },

        getPicPath(fileName) {
            console.log("PATH", productPicPath + fileName)
            if(fileName) {
                // return images('./' + fileName)
                return productPicPath + fileName;
                // let images = require.context(productPicPath, false, /\.png$/)
                // return images('./' + fileName)

                // console.log("PATH", productPicPath + fileName)
                // const url = require('@' + productPicPath + fileName)
                // return url;
            }
        }
    },

    created() {
        this.setProduct();
    }
}
</script>


<template>
    <div v-cloak>
        <div class="tar mbm">
            <el-button type="primary"
                       @click="openPicEditModal()">ADD PICTURE</el-button>
        </div>

        <div v-if="!product.pics || !product.pics.length" class="colorGrayLighter">none</div>
        <div v-else>
            <!-- <div class="colorGrayLighter fs14 phm">{{ `${product.pics.length} ${this.$tc('results', product.pics.length)}` }}</div> -->
            <table class="table widthAll">
                <thead>
                    <tr>
                        <th>Pic</th>
                        <th>File name</th>
                        <th>Sort order</th>
                        <th>Visible</th>
                        <th>Featured?</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pic in product.pics" :key="pic.id">
                        <td>
                            <a @click="openPicQuickView(pic)" v-if="pic.file_name">
                                <img :src="getPicPath(pic.file_name)" class="width50" />
                            </a>
                        </td>
                        <td class="hide_medium_down">{{ pic.file_name }}</td>
                        <td class="tac">{{ pic.sort_order }}</td>
                        <td>
                            <i v-if="pic.is_visible" class="fa fa-check-square colorGreen"></i>
                        </td>
                        <td>
                            <i v-if="product.featured_pic === pic.file_name" class="fa fa-check-square colorGreen"></i>
                        </td>
                        <td class="tac">
                            <i class="fa fa-trash fs20 colorRed mlm cursorPointer" @click="deletePic(pic)"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- product pic dialog -->
        <el-dialog :title="picViewModal.pic.file_name"
                   :visible.sync="picViewModal.isActive"
                   :modal-append-to-body="false"
                   width="95%">
            <div class="tac">
                <img :src="getPicPath(picViewModal.pic.file_name)" />
            </div>
        </el-dialog>


        <!-- product picture edit dialog -->
        <el-dialog :title="picModal.form.file_name ? 'Edit picture \''+picModal.form.file_name+'\'' : 'Add picture'"
                   :visible.sync="picModal.isActive"
                   :modal-append-to-body="false">

            <form-row label="Product:">{{ product.title }}</form-row>

            <form-row label="Is visible:">
                <el-checkbox v-model="picModal.form.is_visible"></el-checkbox>
            </form-row>

            <form-row label="Sort order:">
                <el-input-number 
                    v-model="picModal.form.sort_order" 
                    controls-position="right" 
                    :step="1"></el-input-number>
                <p role="alert" v-show="$v.picModal.form.sort_order.$invalid">{{ $t('Required') }}</p>
            </form-row>

            <form-row label="Upload picture:">
                <div v-if="!picModal.tempImage">
                    <input type="file" ref="file" @change="onFileChange" />
                </div>
                <div v-else class="mtm">
                    <img :src="picModal.tempImage" width="200" />
                    <div class="colorRed tal vat">
                        <span class="cursorPointer" @click="deleteTempImage()">
                            <i class="fa fa-trash fs14 colorRed cursorPointer vam" ></i> remove
                        </span>
                    </div>
                </div>
                <div v-else>
                    <!-- TODO: current product pic goes here -->
                </div>
            </form-row>

            <form-row label="">
                <div class="ptl">
                    <el-button 
                        type="primary" 
                        class="mrm" 
                        @click="savePic(picModal.form.id)"
                        :disabled="$v.picModal.form.$invalid">SAVE</el-button>
                    <el-button @click="picModal.isActive = false">CANCEL</el-button>
                </div>
            </form-row>
        </el-dialog>
    </div>
</template>