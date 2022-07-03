const mongoose = require('mongoose');

const {schema} = require('./security/commentValidation')

const commentsSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true,
        max : 2000,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post : {
        type : String,
        required : true,
    },
    createAt : {
        type: Date,
        default : Date.now
    },
    isItReply :{ 
        type:String,
        default: ''
    },

})

commentsSchema.statics.commentValidation= function(body) {
    return schema.validate(body,{ebortEarly : true})
}

module.exports = mongoose.model('Comment',commentsSchema)