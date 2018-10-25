var express = require('express');

var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var ContactsModel = require('../models/ContactsModel');
var CommentsModel = require('../models/CommentsModel');


var paginate = require('express-paginate'); // paginate

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' ); // 루트의 uploads위치에 저장한다.
var fs = require('fs');

// function testMiddleWare(req, res, next){
//     console.log('middle ware');
//     next(); //제어권을 다음으로 넘김. 인자값을 다음으로 넘긴다 이런건가????
// }

// csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });


//multer setting
var multer = require('multer');
var storage = multer.diskStorage({
    destination : function (req, file, callback){
        callback(null, uploadDir);
    },
    filename : function(req, file, callback){ //이건 작성자가 임의로 filename을 만들어 준거임
        callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
var upload = multer({storage : storage});



var loginRequired = require('../libs/loginRequired');

var co = require('co');





router.get('/', function(req, res){ //admin 이후 url
    res.send('adimin url');
});


////////////////////products routes
// router.get('/products', function(req, res){ 
//     //근데 이게 왜 페이지 콘솔엔 안찍히고 터미널 콘솔에 찍히는지?????????
//     //미들웨어는 관리자만 한다 하면 리콰어로 설정해주고 미들웨어 지금처럼 껴놓으면 된다.

//     ProductsModel.find({}, function(err, products){ //1번 인자는 에러로 2번째 인자는 받고싶은 변수 이름으로.
//         res.render('admin/products',{products : products} )
//     });


//    //res.send('admin products'); 
// //    res.render('admin/products', {school :  "nodejs"}); //template 사용
// }); 이게 원래 그냥 페이지네이션 없이 조져놓은거


router.get('/products', paginate.middleware(3, 50), async(req,res) => { 
    const [ results, itemCount ] = await Promise.all([
        // ProductsModel.find().limit(req.query.limit).skip(req.skip).exec(),
        ProductsModel.find().sort('-created_at').limit(req.query.limit).skip(req.skip).exec(), 
        //이게 생성되면 첫 페이지로 호출되게하는거 sort(-1) 이거의 느낌인데 1대신에 저 만든 시간에 따라서 하는듯함.

        ProductsModel.count()
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);

    const pages = paginate.getArrayPages(req)( 3 , pageCount, req.query.page);

    res.render('admin/products', {
        products : results,
        pages: pages,
        pageCount : pageCount,
    });
});

// router.get('/products/write', function(req,res){
//     res.render( 'admin/form', {product : ""});
// });// 폼택을 재활용해서 수정할때 등록할때도 쓸라고 form으로 했음

router.get('/products/write', loginRequired, csrfProtection , function(req,res){ // token generator
    //edit에서도 같은 form을 사용하므로 빈 변수( product )를 넣어서 에러를 피해준다
    res.render( 'admin/form' , { product : "", csrfToken : req.csrfToken() }); 
});



router.post('/products/write', loginRequired, upload.single('thumbnail'), csrfProtection,function(req,res){

    console.log(req.file) // 위에 업로드 싱글 대신에 어레이로 받아올수있음 여기에다가 req.file[1] 이런식으로 하면 됨


    var product = new ProductsModel({
        name : req.body.name,
        thumbnail : (req.file) ? req.file.filename : "", //얘는 왜 포스트인데도 바디가 안들어가지???????
        price : req.body.price, //body는 post방식일때
        description : req.body.description,
        username : req.user.username
    });
    // var validationError = product.validateSync(); // validation sync는 앞에서 모든 벨리데이션을 통과하면 들어오게끔 하는 
    if(!product.validateSync()){
        product.save(function(err){
            res.redirect('/admin/products');
        });
    }

});

// router.get('/products/detail/:id' , function(req, res){
//     //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
//     ProductsModel.findOne( { 'id' :  req.params.id } , function(err ,product){
//         res.render('admin/productsDetail', { product: product });  
//     });
// });

router.get('/products/detail/:id' , function(req, res){
    // //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    // ProductsModel.findOne( { 'id' :  req.params.id } , function(err ,product){
    //     //제품정보를 받고 그안에서 댓글을 받아온다.
    //     CommentsModel.find({ product_id : req.params.id } , function(err, comments){
    //         res.render('admin/productsDetail', { product: product , comments : comments });
    //         //위에 보내주는 알규먼트의 코멘츠를 저 프로덕트 디테일의 코멘츠라는 키값으로 할당시켜준다는거네
    //     });      
    //     //        CommentsModel.find({ product_id : req.params.id } , function(err, comments){
  
    // });
    // //            res.render('admin/productsDetail', { product: product , comments : comments });



// var getData = co(function* (){
//         // var product = yield ProductsModel.findOne( { 'id' :  req.params.id }).exec();
//         // var comments = yield CommentsModel.find( { 'product_id' :  req.params.id }).exec();
//     //     return {
//     //         product : yield ProductsModel.findOne( { 'id' :  req.params.id }).exec(); //product,
//     //         comments : yield CommentsModel.find( { 'product_id' :  req.params.id }).exec(); //comments
//     //     };
//     // });
//     // getData.then( function(result){
//     //     res.send(result);

//     //////// async로 최적화
    
    var getData = async ()=>{
        return {
            product : await ProductsModel.findOne( { 'id' :  req.params.id }).exec(),
            comments : await CommentsModel.find( { 'product_id' :  req.params.id }).exec()
        };
    };
    getData().then( function(result){
        res.render('admin/productsDetail', { product: result.product , comments : result.comments });
    });

// });
    // router.get('/products/detail/:id' , async(req, res) => {
    //     try{
    //         var product = await ProductsModel.findOne( { 'id' :  req.params.id }).exec();
    //         var comments = await CommentsModel.find( { 'product_id' :  req.params.id }).exec();
            
    //         res.render('admin/productsDetail', { product: product , comments : comments });
    //     }catch(e){
    //         res.send(e);
    //     }
    // });
    // router.get('/products/detail/:id' , async(req, res) => {
    //         var product = await ProductsModel.findOne( { 'id' :  req.params.id }).exec();
    //         var comments = await CommentsModel.find( { 'product_id' :  req.params.id }).exec();
            
    //         res.render('admin/productsDetail', { product: product , comments : comments });
        
    // });
});
   


router.get('/products/edit/:id' , csrfProtection, function(req, res){
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    ProductsModel.findOne({ id : req.params.id } , function(err, product){
        res.render('admin/form', { product : product, csrfToken : req.csrfToken() }); 
    }); // get은 토큰을 미들웨어로 걸어주고 보내는 값으로도 보내야함.
});



// router.post('/products/edit/:id',upload.single('thumbnail'), csrfProtection, function(req, res){ //post는 미들웨어만 걸어주면 확인해줌
        
// ////////// csrf 앞에가 와야하는지는 인풋값으로 받아오는값들을 다 받아오고 난 후에 토큰 주고 해야지 아니면 토큰이 비니깐.

//     ProductsModel.findOne( {id : req.params.id} , function(err, product){

        
//         //넣을 변수 값을 셋팅한다
//         var query = {
//             name : req.body.name,
//             thumbnail : (req.file) ? req.file.filename : product.thumbnail, //얘는 왜 포스트인데도 바디가 안들어가지???????
//             price : req.body.price,
//             description : req.body.description,
//         },

//         //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
//         ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
//             res.redirect('/admin/products/detail/' + req.params.id ); //수정후 본래보던 상세페이지로 이동
//         })
//     }); // 아니 업로드 창에 왜 지금 업로드 되어있는 파일명이 뜨게는 못할까?
// });


router.post('/products/edit/:id', upload.single('thumbnail'), csrfProtection, function(req, res){
    
    ProductsModel.findOne( {id : req.params.id} , function(err, product){
        //넣을 변수 값을 셋팅한다
        if(req.file && product.thumbnail){  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + product.thumbnail );
        } //지금 위에는 동기방식이고,  콜백으로 없애는것도 가능함.

        var query = {
            name : req.body.name,
            thumbnail : (req.file) ? req.file.filename : product.thumbnail,
            price : req.body.price,
            description : req.body.description,
        };

        //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
        ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
            res.redirect('/admin/products/detail/' + req.params.id ); //수정후 본래보던 상세페이지로 이동
        });

    });
});


router.get('/products/delete/:id', function(req, res){
    ProductsModel.remove({ id : req.params.id }, function(err){
        res.redirect('/admin/products');
    });
});








////////////contacts routes

router.get('/contacts', function(req, res){

    ContactsModel.find({}, function(err, contacts){ //1번 인자는 에러로 2번째 인자는 받고싶은 변수 이름으로.
        res.render('admin/contacts',{contacts : contacts} )
    });


   //res.send('admin contacts'); 
//    res.render('admin/contacts', {school :  "nodejs"}); //template 사용
});

router.get('/contact/write', function(req,res){
    res.render( 'admin/contactForm', {contact : ""});
});// 폼택을 재활용해서 수정할때 등록할때도 쓸라고 form으로 했음


router.post('/contact/write', function(req,res){
    var contact = new ContactsModel({
        name : req.body.name,
        email : req.body.email, //body는 post방식일때
        PhoneNumber : req.body.PhoneNumber,
    });
    contact.save(function(err){
        res.redirect('/admin/contacts');
    });
});

router.get('/contacts/detail/:id' , function(req, res){
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    ContactsModel.findOne( { 'id' :  req.params.id } , function(err ,contact){
        res.render('admin/contactsDetail', { contact: contact });  
    });
});

router.get('/contacts/edit/:id' ,function(req, res){
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    ContactsModel.findOne({ id : req.params.id } , function(err, contact){
        res.render('admin/contactForm', { contact : contact });
    });
});



router.post('/contacts/edit/:id', function(req, res){
    //넣을 변수 값을 셋팅한다
    var query = {
        name : req.body.name,
        email : req.body.email,
        PhoneNumber : req.body.PhoneNumber,
    };

    //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
    ContactsModel.update({ id : req.params.id }, { $set : query }, function(err){
        res.redirect('/admin/contacts/detail/' + req.params.id ); //수정후 본래보던 상세페이지로 이동
    });
});

router.get('/contact/delete/:id', function(req, res){
    ContactsModel.remove({ id : req.params.id }, function(err){
        res.redirect('/admin/contacts');
    });
});





router.post('/products/ajax_comment/insert', function(req,res){
    var comment = new CommentsModel({
        content : req.body.content,
        product_id : parseInt(req.body.product_id) //parseInt 로 하면 문자열로 날아와도 숫자열로 만들어줌
    });
    comment.save(function(err, comment){
        res.json({
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    });

});


router.post('/products/ajax_comment/delete', function(req, res){
    CommentsModel.remove({ id : req.body.comment_id } , function(err){
        res.json({ message : "success" });
    });
});


router.get('/mypage', function(req,res){
    // UserModel.findOne({ id : req.session.user_id } , function(err, user){
    // });
    res.render('/mypage', { user : req.user });

});
 
router.post('/mypage/edit', function(req, res){
    //넣을 변수 값을 셋팅한다
    var query = {
        displayname : req.body.displayname
    };

    //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
    UserModel.update({ displayname : req.params.displayname }, { $set : query }, function(err){
        res.redirect('/mypage'); //수정후 본래보던 상세페이지로 이동
    });
});


router.post('/products/ajax_summernote', loginRequired, upload.single('thumbnail'), (req,res) => {
    res.send('/uploads/' + req.file.filename);
});

module.exports = router;