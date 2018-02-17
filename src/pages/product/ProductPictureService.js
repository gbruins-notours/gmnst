'use strict';

import { getHttp } from '../../util/http-common';

export default class ProductPictureService {
    // constructor() {
    // }

    create(formData) {
        return getHttp()
            .post(
                `/api/v1/product/pic/create`, 
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            .then((response) => {
                return response.data.data;
            });
    }

    update(pic) {
        return getHttp()
            .post(`/api/v1/product/pic/update`, pic)
            .then((response) => {
                return response.data.data;
            });
    }

    delete(id) {
        return getHttp()
            .post(`/api/v1/product/pic/delete`, { id })
            .then((response) => {
                return response.data.data;
            });
    }
}