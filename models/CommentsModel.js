var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {autoIncrement} = require('mongoose-plugin-autoinc');

var CommentsSchema = new Schema({
    content : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    product_id : Number
});


CommentsSchema.plugin( autoIncrement,
    {
        model: "comments", field : "id", startAt: 1
    });

module.exports = mongoose.model("comments", CommentsSchema);

// 이런건 레일즈랑 다르게 필드가 자주 바뀌고 그럴때 유용함.