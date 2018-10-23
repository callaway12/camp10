
var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var UserModel = require('../models/UserModel');
/* GET my page. */
router.get('/', function(req,res){
    ProductsModel.find( function(err,user){ //첫번째 인자는 err, 두번째는 받을 변수명
        res.render( 'mypage' , 
            { user : user } // DB에서 받은 products를 products변수명으로 내보냄
        );
    });
});

module.exports = router;