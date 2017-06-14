
module.exports = function (bookshelf, ShoppingCartItem) {
    return bookshelf.Collection.extend({
        model: ShoppingCartItem
    });
};
