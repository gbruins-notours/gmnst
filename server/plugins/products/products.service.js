
const isObject = require('lodash.isobject');


/**
 * Returns the integer representation for each binary gender type
 * @returns {}
 */
function getGenderTypes() {
    return {
        GENDER_TYPE_MENS: 0x01, // 00000001
        GENDER_TYPE_WOMENS: 0x02, // 00000010
        GENDER_TYPE_BOYS: 0x04, // 00000100
        GENDER_TYPE_GIRLS: 0x08  // 00001000
    };
}


function getSizeTypes() {
    return [
        'SIZE_YOUTH_XS',
        'SIZE_YOUTH_S',
        'SIZE_YOUTH_M',
        'SIZE_YOUTH_L',
        'SIZE_YOUTH_XL',
        'SIZE_ADULT_XS',
        'SIZE_ADULT_S',
        'SIZE_ADULT_M',
        'SIZE_ADULT_L',
        'SIZE_ADULT_XL',
        'SIZE_ADULT_2XL',
        'SIZE_ADULT_3XL',
        'SIZE_ADULT_4XL'
    ];
}


function getSizeTypeSortOrder(size) {
    let types = getSizeTypes();
    let index = types.indexOf(size);
    return index > -1 ? index : types.length;
}


function getProductTypes() {
    return {
        PRODUCT_TYPE_APPAREL: 0x01 // 00000001
    };
}


function getProductSubTypes() {
    return {
        PRODUCT_SUBTYPE_HAT: 0x01, // 00000001
        PRODUCT_SUBTYPE_TOP: 0x02  // 00000010
    };
}


function featuredProductPic(productJson) {
    let pic = null;

    if(Array.isArray(productJson.pics)) {
        let len = productJson.pics.length;

        // The related sizes for a product are ordered by sort order (ASC)
        // so the first 'is_visible' pic will be the featured pic
        for(let i=0; i<len; i++) {
            if(productJson.pics[i].is_visible && productJson.pics[i].file_name) {
                pic = productJson.pics[i].file_name;
                break;
            }
        }
    }

    return pic;
}



module.exports.getGenderTypes = getGenderTypes;
module.exports.getSizeTypes = getSizeTypes;
module.exports.getSizeTypeSortOrder = getSizeTypeSortOrder;
module.exports.getProductTypes = getProductTypes;
module.exports.getProductSubTypes = getProductSubTypes;
module.exports.featuredProductPic = featuredProductPic;