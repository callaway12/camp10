
var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var UserModel = require('../models/UserModel');
/* GET my page. */
router.get('/', function(req,res){
        res.render( 'mypage' , 
            { user : req.user } // 여기에 왜 req로 해야 반영이 될까? req 배면 안되던데
        );
});






module.exports = router;
