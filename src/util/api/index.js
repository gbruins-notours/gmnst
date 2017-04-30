import { HTTP } from '../http-common';


export default {
    getToken() {
        return HTTP.post('/api/v1/token/get', {
            clientId: 'test@test.com',
            clientSecret: '$2a$10$axHavFL8ndZjSAL9qaB3ruzsjf9.Dz2VLWDpi2.JRIVcyrmISMuFG'
        });
    },

    hashValue(val) {
        return HTTP.post('/api/v1/hash', {
            value: val
        });
    },

    sayHello() {
        return HTTP.get('/api/v1/hello').then((response) => {
            return response.data;
        });
    }
};
