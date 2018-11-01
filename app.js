//첫 서버 띄우는 파일
var express = require('express');

var admin = require('./routes/admin'); //express 밑에다 적어야함.!!!!
var accounts = require('./routes/accounts'); /////여기 앞에닥 . 적는 이유가 뭘까???????? //현재 폴더에서 라는 뜻임

var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');


var logger = require('morgan');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');




var app = express();
var path = require('path');
var mongoose = require('mongoose'); //몽구스 연결
mongoose.Promise = global.Promise;
var port = 3000;

/////////이게 아마 젬파일이지 싶은데...


var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('mongodb connect');
});

var connect = mongoose.connect('mongodb://127.0.0.1:27017/fastcampus', { useMongoClient: true });



var auth = require('./routes/auth'); 




var home = require('./routes/home.js');


var chat = require('./routes/chat.js');

var mypage = require('./routes/mypage.js')

var mypage_edit = require('./routes/mypage_edit.js');

var products = require('./routes/products');

var cart = require('./routes/cart.js');

var checkout = require('./routes/checkout');

// 확장자가 ejs 로 끈나는 뷰 엔진을 추가한다.
app.set('views', path.join(__dirname, 'views'));
console.log(__dirname);
app.set('view engine', 'ejs'); //view engine 의 확장자를 ejs로 조진다 
//set 은 이 앱의 환경설정이라서 항상 get이나 use의 위에 위치






//미들웨어 세팅
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(function(){

// }); 이런 미들웨어 한다 하면 req의 변수를 더 설정해주는 느낌이다. body를 건드리면 폼택에서 들고오는 바디를 고칠수도 있고


// cokie parser
// app.use(logger('dev')); //what does this doing??
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//업로드 path 추가
app.use('/uploads', express.static('uploads'));


// //session 관련 셋팅
// app.use(session({
//     secret: 'fastcampus',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 2000 * 60 * 60 //지속시간 2시간
//     }
// }));

//session 관련 셋팅
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session);

var sessionMiddleWare = session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60
    })
});
app.use(sessionMiddleWare);

app.use('/uploads', express.static('uploads'));


app.use('/static', express.static('static'));



//passport 적용 //이거가 미들웨어로 작용한다는건데....
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());
app.use(function(req, res, next) {
    // app.locals.myname = "nodejs";
    app.locals.isLogin = req.isAuthenticated(); //locals가 뭘까?
    
    app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅

    //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
    next();
});




//flash  메시지 관련
var flash = require('connect-flash');
 
//passport 로그인 관련
var passport = require('passport');
var session = require('express-session');




app.use('/admin', admin); //use == 'middle ware' apply the admin shit to this url.
app.use('/accounts', accounts);

app.use('/auth', auth);

app.use('/products', products);


// app.get('/admin', function(req,res){
//     res.send('admin page ad32');
// });  -> admin 들고와서 주석처리
app.use('/cart', cart);




app.use('/', home);



app.use('/chat', chat); //이것들 한번에 다 모아서 보는게 낫지 싶음


app.use('/mypage', mypage);

app.use('/mypage/edit', mypage_edit);
// app.put('/mypage/users/:id', routes.users.update);



app.use('/checkout', checkout);


var server = app.listen(port, function(){
    console.log('Express listening on port', port);
});

// var listen = require('socket.io');
// var io = listen(server);
// require('./libs/socketConnection')(io);// 이걸 뭐 줄였다는데 

var listen = require('socket.io');
var io = listen(server);
//socket io passport 접근하기 위한 미들웨어 적용
io.use(function(socket, next){
  sessionMiddleWare(socket.request, socket.request.res, next);
});
require('./libs/socketConnection')(io);



// 8443번에 https적용 -------------
var https = require('https');
var fs = require('fs');
var httpsServer = https.createServer(
    {
        key: fs.readFileSync('ssl/localhost.key').toString(), 
        cert: fs.readFileSync('ssl/localhost.crt').toString()
    }, 
app ).listen(8443);

