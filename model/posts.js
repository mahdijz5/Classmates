const mongoose = require('mongoose');
const moment = require('jalali-moment')

const {schema} = require('./security/postValidation')


const blogSchema = new mongoose.Schema({
    title : {
        maxlength : 120,
        required: true,
        type : String,
    },
    body : {
        type : String,
        required : true,
    },
    status : {
        type: String,
        default : "public",
        enum : ["private" , "public"]
    },
    grade : {
        type: String,
        default : "others",
        enum : ['firstbas','secondbas','thirdBas','fourth','fifthBas','sixthtBas','seventh','eighth','ninethe','others']
    },
    book : {
        type: String,
        default : "others",
        enum : ['quran','farsi','oloom','math','payam','english','honar','amadegi','arabic','others']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date : {
        type: Date ,
        default : Date.now
    },
    thumbnail : {
        type : String,
        required: true
    },
    views: {
        type : Number,
        default : 0,
    },
    viewedBy : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    commentsNum : {
        type : Number,
        default : 0,
    },
    likes: {
        type : Number,
        default : 0,
    },
    likedBy : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
})


blogSchema.index({title : 'text'}) 

blogSchema.statics.postValidation = function (body) {
    return schema.validate(body,{abortEarly: true})
}


module.exports = mongoose.model('Post',blogSchema)

