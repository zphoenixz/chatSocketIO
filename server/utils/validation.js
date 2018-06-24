var isRealString = (str) => {
    return typeof str == 'string' && str.trim().length > 0;// '  asd  ' -> 'asd'
};

module.exports = {isRealString};