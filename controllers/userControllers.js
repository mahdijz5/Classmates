const User = require('../model/users');

const passport = require('passport');
const fetch = require('node-fetch');

exports.getRegister = (req,res) => {
    return res.render('register', {
        pageTitle : 'Register',
        path : '/login',
        layout: './layouts/loginLayout',
    })
}

exports.handleRegister =  async (req,res) => {
    const errors = {}
    try {
        const  {username,password,confirmPassword} = await req.body
    
        const existUsername = await User.findOne({username})
        
        if(existUsername){
            
            return res.render('register',{
                pageTitle : 'Register',
                path : '/login',
                errors : 'This username is exist',
                layout: './layouts/loginLayout',
                
            })
        }

        await User.userValidation({
            username,
            password,
            confirmPassword
        })

        await User.create({
            username,
            password,
            confirmPassword
        })

        req.flash('success','You have successfully registered')
        res.render("login", {
            pageTitle : 'Register',
            path : '/login',
            successMsg : req.flash('sucess'),
            layout: './layouts/loginLayout',
            error : req.flash('error'),
        } )

    } catch (err) {
        console.log(err);
        errors["errors"] = err.errors

        console.log(errors);
        return res.render('register',{
            pageTitle : 'Register',
            path : '/login',
            errors : errors.errors ,
            layout: './layouts/loginLayout',
            
        })
    }
}

exports.getLogin = (req,res) => {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    return res.render('login', {
        pageTitle : 'Login',
        path : '/login',
        layout: './layouts/loginLayout',
        error : req.flash('error')
    })
}


exports.handleLogin = async(req ,res, next ) => {
        passport.authenticate('local',{
            failureRedirect : '/user/login',
            failureFlash : true,
        })(req, res, next)
    
    

}

exports.rememberMe = (req,res) => {
    if(req.body.remember) {
        req.session.cookie.originalMaxAge =  1000 *60 * 60 *24
    }else{
        req.session.cookie.expire = null
    }
    res.redirect('/admin/dashboard')
}

// exports.logout = (req,res) => {
// 	res.set(
//         "Cache-Control",
//         "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
//     );
//     req.session = null;
//     req.logout()
//     // req.flash('success_msg', 'شما از حساب خود خارج شدید')
//     res.redirect('/user/login')
// }

exports.logout = (req, res) => {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.logout()
    // req.flash('success_msg', 'شما از حساب خود خارج شدید')
    res.redirect('/')
}