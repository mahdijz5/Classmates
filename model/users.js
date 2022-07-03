const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const {schema} = require('./security/userValidation');

const userSchema = new mongoose.Schema({
	username: {
		required: true,
		type: String,
		trim: true,
		minlength: 2,
		maxlength: 80,
        unique : true
	},
	password: {
		type : String,
        required: true,
		minlength: 4,
		maxlength: 80,
	},
	email : {
		type : String
	},
    createAt : {
        type : Date,
        default : Date.now
    },
	profileImg : {
		type : String,
		default : 'placeholder.png'
	}
});

userSchema.statics.userValidation = function(body) {
    return schema.validate(body,{abortEarly : true})
}

//middleWare
userSchema.pre('save',function(next) {
	let user = this
	
	if(!user.isModified('password')) return next()

	bcrypt.hash(user.password,10, (err,hash) => {
		if(err) return next(err);

		user.password = hash

		next()
	})
})

module.exports = mongoose.model('User',userSchema)