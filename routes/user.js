const {Router} = require('express');

const router = new Router()

const userController = require('../controllers/userControllers');
const {auth} = require('../middleWares/auth')

// @route GET user/login
// @desc get a login page
router.get('/login',userController.getLogin)

// @route POST user/login
// @desc handle login
router.post('/login',userController.handleLogin,userController.rememberMe)

// @route GET user/register
// @desc get a Register page
router.get('/register',userController.getRegister)

// @route POST user/register
// @desc Handle Register 
router.post('/register',userController.handleRegister)

// @desc logout 
//@route GET /user/logout
router.get('/logout' , auth , userController.logout)

module.exports = router