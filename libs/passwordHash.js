var crypto = require('crypto'); //내장 모듈
var mysalt = "fastcampus";

module.exports = function(password){
    return crypto.createHash('sha512').update( password + mysalt).digest('base64');
};