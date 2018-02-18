'use strict';

import { getHttp } from '../../util/http-common';

export default class ProductPictureService {
    // constructor() {
    // }

    upsert(formData) {
        return getHttp()
            .post(
                '/api/v1/product/pic/upsert',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
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