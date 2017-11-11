import { getHttp } from '../http-common';

export default {
    logger(type, message) {
        if(message) {
            return getHttp().post('/api/v1/logger', {
                type: type || 'error',
                message: message
            });
        }
    },
    
    // Utility methods:
    getApiErrorMessage(error) {
        let msg = error.message;
        
        if (error.response) {
            msg = error.response.data.message;
        }

        return msg;
    }
};
