const pick = (obj, keys) => {

    const finalObj = {};
    for (const key of keys) {
        finalObj[key] = obj[key];
    }
    return finalObj;

};

module.exports = pick;