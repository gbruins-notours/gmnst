'use strict';

import { getHttp } from './util/http-common';

export default class UtilityService {

    getJwtToken() {
        return getHttp()
            .post('/api/v1/token/get')
            .then((response) => {
                // Token is returned in the 'x-authorization' response header
                return response.headers['x-authorization'];
            });
    }

    getHelpEmailAddress() {
        return 'help@gmnst.com';
    }

    getBrandName() {
        return 'Gmnst';
    }

    getSiteName() {
        return 'gmnst.com';
    }

    getSiteUrl() {
        return 'www.gmnst.com';
    }

}