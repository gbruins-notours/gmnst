import isObject from 'lodash.isobject';
import axios from 'axios';

let internals = {};

internals.getHeaders = () => {
    let data = JSON.parse(window.localStorage.getItem('vuex'));
    let headers = {};

    if (isObject(data) && data.hasOwnProperty('jwtKey')) {
        headers['Authorization'] = `Bearer ${data.jwtKey}`;
    }

    return headers;
};


export const HTTP = axios.create({
    headers: internals.getHeaders()
});
