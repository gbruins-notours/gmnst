'use strict';

import Promise from 'bluebird';
import { getHttp } from '../../util/http-common';
import ProductService from '@/pages/product/ProductService.js'

let productService = new ProductService();

export default class ProductSizeService {
    // constructor() {
    // }

    buildSizeOptions(product) {
        return new Promise((resolve, reject) => {
            let sizeOpts = [];
            let maxInventoryCount = 0;

            if (Array.isArray(product.sizes)) {
                product.sizes.forEach((obj) => {
                    if (obj.is_visible && obj.inventory_count) {
                        sizeOpts.push(obj.size);

                        if (obj.inventory_count > maxInventoryCount) {
                            maxInventoryCount = obj.inventory_count;
                        }
                    }
                });
            }

            resolve({
                sizeOpts,
                maxInventoryCount
            });
        });
    }

    buildMissingSizeOptions(product) {
        return productService
            .getProductInfo()
            .then((productInfo) => {
                if(!productInfo) {
                    throw new Error(this.$t('Product sizes not found'));
                }

                let usedSizeIds = [];
                let options = [];

                product.sizes.forEach((size) => {
                    usedSizeIds.push(size.size);
                });

                productInfo.sizes.forEach((id) => {
                    if(usedSizeIds.indexOf(id) === -1) {
                        options.push(id);
                    }
                });

                return options;
            });
    }

    create(size) {
        return getHttp()
            .post(`/api/v1/product/size/create`, size)
            .then((response) => {
                return response.data.data;
            });
    }

    update(size) {
        return getHttp()
            .post(`/api/v1/product/size/update`, size)
            .then((response) => {
                return response.data.data;
            });
    }

    delete(sizeId) {
        return getHttp()
            .post(`/api/v1/product/size/delete`, { id: sizeId })
            .then((response) => {
                return response.data.data;
            });
    }
}