var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { autoIncrement } = require('mongoose-plugin-autoinc');

//생성될 필드명을 정한다.
var ProductsSchema = new Schema({
    name : {
        type: String,
        required: [true, "type the title"]
    }, //제품명
    thumbnail : String, //이미지 파일명
    price : Number, //가격
    description : String, //설명
    created_at : { //작성일
        type : Date,
        default : Date.now() //자동등록
    },
    username: String //작성자 추가
});

//virtual 변수는 호출되면 실행하는 함수
// Object create 의 get과 set과 비슷함
//set은 변수의 값을 바꾸거나 셋팅하면 호출
// get은 getDate변수를 호출하는 순간 날짜 월일이 찍힌다.
ProductsSchema.virtual('getDate').get(function(){
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1, //month는 10월이면 9월로 나온다함.. 0부터 시작이라 그렇다네?
        day : date.getDate()
    };
});
ProductsSchema.virtual('getAmountFormat').get(function(){ //getAmountFormat 이게 그 넘버포맷 라이브러리라함
    // 1000원을 1,000원으로 바꿔준다.
    return new Intl.NumberFormat().format(this.paid_amount);
});

// 1씩 증가하는 primary Key를 만든다  밑에 코드들이
// model : 생성할 document 이름
// field : primary key , startAt : 1부터 시작
ProductsSchema.plugin( autoIncrement , { model : 'products' , field : 'id' , startAt : 1 });
module.exports = mongoose.model('products', ProductsSchema); //콜렉션 명을 지정, 프로덕츠라고. 