var p1 = new Promise(
    function(resolve, reject){
        console.log ("프라미스 함수제작");
        //0.5초 뒤에 콘솔에 찍힘
        setTimeout(
            function(){
                //프라미스 이행 될때 실행할 부분을 resolve로 적습니다.
                resolve( console.log("프라미스 이행") );
            },500);
    }
);

p1.then( () =>{
    console.log("프라미스 완료!");

});



var p1 = new Promise(
    function(resolve, reject){
        console.log ("프라미스 함수제작");
        //0.5초 뒤에 콘솔에 찍힘
        setTimeout(
            function(){
                //프라미스 이행 될때 실행할 부분을 resolve로 적습니다.
                resolve( {p1 : "asdf"} );
            },500);
    }
);

p1.then( (result) =>{
    console.log(result.p1);

});


var p2 = new Promise(
    function(resolve, reject){
        console.log ("프라미스 함수제작");
        //0.5초 뒤에 콘솔에 찍힘
        setTimeout(
            function(){
                //프라미스 이행 될때 실행할 부분을 resolve로 적습니다.
                resolve( {p2 : "소정이 좋아"} );
            },300);
    }
);

p2.then( (a) =>{
    console.log(a.p2);

});



// Promise.reject("Testing static reject").then(function(reason) {
//     // 호출되지 않음
//   }, function(reason) {
//     console.log(reason); // "Testing static reject"
//   });
  
//   Promise.reject(new Error("fail")).then(function(error) {
//     // 호출되지 않음
//   }, function(error) {
//     console.log(error); // Stacktrace
//   }); 리젝트가 나오면 무조건 출력으로 리젝이 되는데 이건 에러처리용






Promise.all([p1, p2]).then( (result) => {
    console.log(result);
    console.log( "p1" + result[0].p1);
    console.log( "p2" + result[1].p2);
})