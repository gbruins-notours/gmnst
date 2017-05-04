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
import _ from 'lodash';
import { mapGetters } from 'vuex';
import ProductCard from '../../product/ProductCard.vue';
import shopApi from '../../../api/shopApi';

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

            _.each(info.product.type, (obj, key) => {
                if (key === type) {
                    id = obj.id
                }
            });

            return id;
        },

        fetchProducts(productTypeId) {
            let typeId = this.getIdByProductType(productTypeId);

            let params = {};
            params.where = ['is_available', '=', false];
            params.andWhere = [
                ['product_type_id', '=', parseInt(typeId)],
                ['inventory_count', '>', 0]
            ];
            params.orderBy = 'updated_at';
            params.orderDir = 'DESC';

            console.log('PARAMS', params);

            shopApi.getProducts(params).then((products) => {
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
.has-text-muted {
  color: #95A5A6;
}
.panel-block-item  {
  display: inline-block;
  color: #95A5A6;
  font-weight: bold;
  padding-right: 10px;
}

.panel-block-item .tag,.panel-block-item .button  {
  color: #95A5A6;
  font-weight: bold;
}

.panel-block-item.is-right {
  display: inline-block;
  color: #95A5A6;
  font-weight: bold;
  float: right;
}

.panel-block-item .likes {
  padding-right: 25px;
}

.panel-block-item .likes .fa,
.panel-block-item .comments .fa
 {
  font-size: 15px;
  margin-top: -2px;
}

.avatar {
  border-radius: 42px;
  margin-right: 10px;
  height: 42px;
  width: 42px;
  padding: 2px;
  border: 1px solid #dbdbdb;
}

.timestamp {
  color: #95A5A6;
  font-weight: bold;
}
</style>

