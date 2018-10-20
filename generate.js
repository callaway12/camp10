function* iterFunc(){
    yield console.log("첫번째 출력");
    yield console.log("두번째 출력");
    yield console.log("셋번째 출력");
    yield console.log("넷번째 출력");
}

var iter = iterFunc();

iter.next();//첫번째 출력
iter.next();//두번째 출력