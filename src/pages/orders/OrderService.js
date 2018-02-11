'use strict';

import { getHttp } from '../../util/http-common';

export default class OrderService {
    // constructor() {
    // }
  
    getOrder(transaction_id, verbose) {
        return getHttp()
            .get('/api/v1/order', {
                params: {
                    transaction_id,
                    verbose
                }
            })
            .then((response) => {
                return response.data.data;
            });
    }
}