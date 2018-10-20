var test = function(a,b){
    return {
        message : "hello",
        value : "world"
    }
}


var test =  (a,b)  =>{
    return {
        message : "hello",
        value : "world"
    }
}

var test =  (a,b)  =>({
        message : "hello",
        value : "world"
})

var test =  a =>({ //인자가 하나만 있을때
    message : "hello",
    value : "world"
})



$(document).on('click' , '.comment_delete' , function(){
    if(confirm('삭제하시겠습니까?')){ //확인창 예 눌렀을 시만 진행
        var $self = $(this);
        $.ajax({
            url: '/admin/products/ajax_comment/delete',
            type: 'POST',
            data: { comment_id : $self.attr('comment_id') }, //여기서 attr 이게 뭘까? 어트리뷰트 ??
        })
        .done( => { //이거 모르겠음... ㅎㅎㅎㅎ...
            $self.parent().remove(); //this 로 받으면 this가 이 함수 안에서 돌기에 안되니깐 아우터 함수에서 self선언해서 받아옴
            alert("삭제가 완료되었습니다."); //?????? self 대신 this로하면 ajex가 안먹고 refresh 해야 프론트에서 삭제가 됨.
        })
        .fail(function(args) {
            console.log(args);
        });
    }
});   