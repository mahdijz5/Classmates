const mongoose = require('mongoose');

const {schema} = require('./security/replyCommentsValidation')

const ReplyCommentsSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true,
        max : 2000,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createAt : {
        type: Date,
        default : Date.now
    },
    comment :{ 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    show : {
        type : Boolean,
        default:true,
        required : true,
    }
})

ReplyCommentsSchema.statics.replyCommentValidation= function(body) {
    return schema.validate(body,{ebortEarly : true})
}

module.exports = mongoose.model('ReplyComment',ReplyCommentsSchema)