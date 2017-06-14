
module.exports = function (bookshelf, ShoppingCart) {
    return bookshelf.Collection.extend({
        model: ShoppingCart
    });
};
