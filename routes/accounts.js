var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passwordHash = require('../libs/passwordHash');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('deserializeUser');
    done(null, user);
});

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, 
    function (req, username, password, done) {
        UserModel.findOne({ username : username , password : passwordHash(password) }, function (err,user) {
            if (!user){
                return done(null, false, { message: '아이디 또는 비밀번호 오류 입니다.' });
            }else{
                return done(null, user );
            }
        });
    }
));





//////////회원가입
router.get('/', function(req, res){
    res.send('account app');
});

router.get('/join', function(req, res){
    res.render('accounts/join');
});

router.get('/login', function(req, res){
    res.render('accounts/login', { flashMessage : req.flash().error });
    
});
router.post('/login' , 
    passport.authenticate('local', { 
        failureRedirect: '/accounts/login', 
        failureFlash: true 
    }), 
    function(req, res){
        res.send('<script>alert("로그인 성공");location.href="/";</script>');
    }
);

router.get('/success', function(req, res){
    res.send(req.user);
});


router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/accounts/login');
});

router.post('/join', function(req, res){
    var User = new UserModel({
        username : req.body.username,
        password : passwordHash(req.body.password),
        displayname : req.body.displayname
    });
    User.save(function(err){
        res.send('<script>alert("회원가입 성공");location.href="/accounts/login";</script>');
    });
});

module.exports = router;


///이렇게 만들고 view에가서 html 조지면 됨

