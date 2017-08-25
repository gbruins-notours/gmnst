import isObject from 'lodash.isobject';
import axios from 'axios';


function getJwtKey() {
    if(!getJwtKey.key) {
        let data = JSON.parse(window.localStorage.getItem('vuex'));

        if (isObject(data) && isObject(data.app) && data.app.jwtKey) {
            getJwtKey.key = data.app.jwtKey
        } 
    }

    return getJwtKey.key;
};


export function getHttp() {
    if(!getHttp.jwtKey) {
        getHttp.jwtKey = getJwtKey();

        if(getHttp.jwtKey) {
            getHttp.axiosClient = axios.create({
                headers: {
                    'Authorization': `Bearer ${getHttp.jwtKey}`
                }
            });
        }
    }

    if(!getHttp.axiosClient) {
        getHttp.axiosClient = axios;
    }

    return getHttp.axiosClient;
};
