
var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var UserModel = require('../models/UserModel');
/* GET my page. */
router.get('/', function(req,res){
        res.render( 'mypage_edit' , 
            { user : req.user } // 여기에 왜 req로 해야 반영이 될까? req 배면 안되던데
        );

    
});


router.post('/', function (req, res) {
    user.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});



module.exports = router;








// router.post('/mypage/edit', function(req, res){
//     req.user.diplayname = 
// })

// var express = require('express');
// var router = express.Router();

// router.get('/' , function(req, res){
    
//     var totalAmount = 0; //총결제금액
//     var cartList = {}; //장바구니 리스트
//     //쿠키가 있는지 확인해서 뷰로 넘겨준다
//     if( typeof(req.cookies.cartList) !== 'undefined'){
//         //장바구니데이터
//         var cartList = JSON.parse(unescape(req.cookies.cartList));

//         //총가격을 더해서 전달해준다.
//         for( var key in cartList){
//             totalAmount += parseInt(cartList[key].amount);
//         }
//     }
//     res.render('cart/index', { cartList : cartList , totalAmount : totalAmount } );
// });


// module.exports = router;