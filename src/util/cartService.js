'use strict';

export default {

    productPic: (cartItem) => {
        if (cartItem.product.featured_pic) {
            return '/static/images/product/' + cartItem.product.featured_pic;
        }
        return;
    }

}