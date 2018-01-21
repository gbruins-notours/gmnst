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

    getSiteUrl(full) {
        if(process.env.NODE_ENV === 'development') {
            return full ? 'http://localhost:3000' : 'localhost:3000';
        }
        else {
            return full ? 'https://www.gmnst.com' : 'www.gmnst.com';
        }
    }

    getTwitterUser() {
        return 'gmnstLife';
    }

}