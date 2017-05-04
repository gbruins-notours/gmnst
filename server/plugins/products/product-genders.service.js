'use strict';


function getGenderTypes() {
    return {
        'male': {'id': 1, 'label': 'Male'},
        'female': {'id': 2, 'label': 'Female'},
        'any': {'id': 3, 'label': 'Any'}
    };
}


module.exports.getGenderTypes = getGenderTypes;

