const passport = require('passport');
const  {Strategy} = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../model/users');


passport.use(
    new Strategy({'usernameField' : 'username'}, async (username,password,done)=>{
        try {
            const user = await User.findOne({username})

            if(!user){ 
                return done(null,false,{
                message: 'Password or username is wrong'
                })
            }

            const checkPass= await bcrypt.compare(password , user.password)

            if(!checkPass) {
                return done(null,false, {
                    message : 'Password or username is wrong'
                })
            }else {
                done(null,user)
            }


        } catch (error) {
            console.log(error);
        }
    })
)

passport.serializeUser((user,done) => {
    done(null,user)
})

passport.deserializeUser((id,done) => {
    User.findById(id,(err,user) => {
        done(err,user)
    })
})