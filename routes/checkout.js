var express = require('express');
var router = express.Router();
var CheckoutModel = require('../models/CheckoutModel');

const { Iamporter, IamporterError } = require('iamporter'); //아임포트 API 받아오는거를 누가 젬파일로 만들어놓은걸 이제 해갖고 하는거임
const iamporter = new Iamporter({
    apiKey: '9239725331277387',
    secret: 'BOa993V7ii14yCrUJJHw3AgWD9OMWxkymuIvyDDQVFVuhmp056x9GO5jXT5UrpsNUajtOWkKBffTBEUH'
});

router.get('/' , function(req, res){
    
    var totalAmount = 0; //총결제금액
    var cartList = {}; //장바구니 리스트
    //쿠키가 있는지 확인해서 뷰로 넘겨준다
    if( typeof(req.cookies.cartList) !== 'undefined'){
        //장바구니데이터
        var cartList = JSON.parse(unescape(req.cookies.cartList)); //이거를 왜 unescape 로 했을까?

        //총가격을 더해서 전달해준다.
        for( let key in cartList){
            totalAmount += parseInt(cartList[key].amount);
        }
    }
    res.render('checkout/index', { cartList : cartList , totalAmount : totalAmount } );
});

router.get('/complete', async (req,res)=>{
    var payData = await iamporter.findByImpUid(req.query.imp_uid);
    var checkout = new CheckoutModel({
        imp_uid : payData.data.imp_uid,
        merchant_uid : payData.data.merchant_uid,
        paid_amount : payData.data.amount,
        apply_num : payData.data.apply_num,
        
        buyer_email : payData.data.buyer_email,
        buyer_name : payData.data.buyer_name,
        buyer_tel : payData.data.buyer_tel,
        buyer_addr : payData.data.buyer_addr,
        buyer_postcode : payData.data.buyer_postcode,

        status : "결재완료",
    });
    await checkout.save();
    res.redirect('/checkout/success');

});








router.post('/complete', (req,res)=>{

    var checkout = new CheckoutModel({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
        
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,

        status : req.body.status,
    });

    checkout.save(function(err){
        res.json({message:"success"});
    });

});
 
 
router.post('/mobile_complete', (req,res)=>{
    var checkout = new CheckoutModel({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,
        
        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,

        status : req.body.status,
    });

    checkout.save(function(err){
        res.json({message:"success"});
    });
});

router.get('/success', function(req,res){
    res.render('checkout/success');
});

router.get('/nomember', function(req,res){
    res.render('checkout/nomember');
});

router.get('/nomember/search', function(req,res){
    CheckoutModel.find({ buyer_email : req.query.email }, function(err, checkoutList){
        res.render('checkout/search', { checkoutList : checkoutList } );
    });
});


module.exports = router;