exports.auth = (req,res,next) => {
    if(req.isAuthenticated() == true){
        return next()
    }else {
        res.redirect('/user/login')
    }
}

exports.notAuth = (req,res,next) => {
    if(req.isAuthenticated() == false){
        return true
    }else {
        return false
    }
}