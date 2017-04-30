import _ from 'lodash';
import axios from 'axios';

let internals = {};

internals.getHeaders = () => {
    let data = JSON.parse(window.localStorage.getItem('vuex'));
    let headers = {};

    if (_.isObject(data) && data.hasOwnProperty('jwtKey')) {
        headers['Authorization'] = `Bearer ${data.jwtKey}`;
    }

    return headers;
};


export const HTTP = axios.create({
    headers: internals.getHeaders()
});
