var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
        // https://developers.facebook.com에서 appId 및 scretID 발급
        clientID: "540592019720654", //입력하세요
        clientSecret: "44a68eb1eba88f1d4a88b442be973c37", //입력하세요.
        callbackURL: "https://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
    },
    function(accessToken, refreshToken, profile, done) {
        //아래 하나씩 찍어보면서 데이터를 참고해주세요.
        console.log(accessToken);
        // console.log(profile.displayName);
        // console.log(profile.emails[0].value);
        // console.log(profile._raw);
        // console.log(profile._json);
        UserModel.findOne({ username: "fb_" + profile.id}, function(err,user){
            if(!user){
                var regData = {
                    username : "fb_" + profile.id,
                    password : "facebook_login",
                    displayname : profile.displayName
                };
                var User = new UserModel(regData);
                User.save(function(err){
                    done(null,regData);
                });
            }else{ //있으면 db에서 가져와서 세션등록
                done(null,user);
            }
        })
        
    }
));

router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

router.get('/facebook/callback',
    passport.authenticate('facebook',
    {
        successRedirect: '/',
        failureRedirect: '/auth/facebook/fail'
    }
    )
);







//로그인 성공시 이동할 주소
router.get('/', function(req,res){
    res.send(req.user);
});

router.get('/facebook/fail', function(req,res){
    res.send('facebook login fail');
});


module.exports = router;