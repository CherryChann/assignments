const _ = require('lodash');
const moment = require('moment')
const SpellChecker = require('spellchecker');

function camelCaseObjectKeys(obj, options = { deep: true }) {
    return changeKeyCase(obj, _.camelCase, options);
}

function changeKeyCase(obj, caseFunc, options) {
    const { deep } = options;

    return _.transform(obj, (result, value, key) => {
        const valueIsArray = _.isArray(value);
        const caseKey = caseFunc(key);
        if (deep && _.isDate(value)) {
            result[caseKey] = moment(value).format('DD/MM/YYYY')
            return;
        }
        if (deep && _.isObject(value) && !valueIsArray) {
            result[caseKey] = changeKeyCase(value, caseFunc, options);
            return;
        }

        if (deep && valueIsArray && _.some(value, _.isObject)) {
            const newArr = [];
            _.each(value, (v) => {
                if (_.isObject(v)) {
                    newArr.push(changeKeyCase(v, caseFunc, options));
                } else {
                    let typo = []
                    if (SpellChecker.isMisspelled(v)) {
                        typo = SpellChecker.getCorrectionsForMisspelling(v)
                        v = typo[0] // first index from suggestion
                    }
                    newArr.push(camelCase(v))
                }
            });
            result[caseKey] = newArr;
            return;
        }

        result[caseKey] = value;
    }, {});
}

module.exports = {
    camelCaseObjectKeys,
};
