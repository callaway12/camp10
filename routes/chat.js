var express = require('express');
var router = express.Router();

router.get('/', function(req,res){ //3000/chat/ 이렇게 오면
    if(!req.isAuthenticated()){ //isAuthenticated는 passport에서 제공하는 함수.
        res.send('<script>alert("로그인이 필요한 서비스입니다.");location.href="/accounts/login";</script>');
    }else{
        res.render('chat/index');
    }
});



module.exports = router;