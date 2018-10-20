// module.exports = function(io){
//     io.on('connection', function(socket){
//         // console.log('채팅 접속 시작');

//         var session = socket.request.session.passport;
//         var user = (typeof session !== 'undefined') ? (session.user ) : "";

//         socket.on('client message', function(data){
//             // console.log (data);
//             io.emit('server message', data.message); // 이게 io 인게 io가 서버를 뜻함.. 그래서 자기를 포함 모두 뿌린다는거임
//             //여기다가 디비에 insert로 저장하면 될듯
        
//         });
        
    
//     });
// }
require('./removeByValue')(); // 바로 함수가 펼
module.exports = function(io) {
    var userList = []; // 밑에 놔두면 새로운 사람 들어올때마다 리스트 새로 초기화 할테니 노노함. 
    io.on('connection', function(socket){ 
        
        //아래 두줄로 passport의 req.user의 데이터에 접근한다.
        var session = socket.request.session.passport;
        var user = (typeof session !== 'undefined') ? ( session.user ) : "";

        // userList 필드에 사용자 명이 존재 하지 않으면 삽입
        if(userList.indexOf(user.displayname) === -1){
            userList.push(user.displayname);
        }
        io.emit('join', userList);


        //사용자 명과 메시지를 같이 반환한다.
        socket.on('client message', function(data){
            io.emit('server message', { message : data.message , displayname : user.displayname });
        });
        
        socket.on('disconnect', function(){            
            userList.removeByValue(user.displayname);
            io.emit('leave', userList);
        });


    });
};