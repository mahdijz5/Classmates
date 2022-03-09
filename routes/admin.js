const {Router} = require('express');

const router = new Router

const adminController = require('../controllers/adminController');
const {auth} = require('../middleWares/auth');


// @desc get dashboard page
//@route GET /admin/dashboard
router.get('/dashboard',auth,adminController.getDash)

// @desc handle dash search
//@route POST /admin/dashboard/search
router.post('/dashboard/search',auth,adminController.handleSearch)

// @desc get   creation page
//@route GET /admin/addPost
router.get('/addPost',auth,adminController.getAddPost)

// @desc post add new post
//@route POST /admin/addPost
router.post('/addPost',auth,adminController.newPost)

// @desc post upload Image
//@route POST /admin/upload-img
router.post('/upload-img',auth,adminController.uploadImg)

// @desc get edit page
//@route GET /admin/edit/:id
router.get('/edit/:id' , auth , adminController.getEditPost)

// @desc handle edit post
//@route POST /admin/editPost/:id
router.post('/editPost/:id' , auth , adminController.editPost)

// @desc handle delete 
//@route GET /delete/:id
router.get('/delete/:id', auth , adminController.deletePost)

// @desc get setting page
//@route GET /admin/setting/
router.get('/setting',auth , adminController.setting)

// @desc change ptofile
//@route POST /admin/changeProfile
router.post('/changeProfile' , auth , adminController.changeProfile)

// @desc change pass 
//@route POST /admin/change-password
router.post('/change-password' , auth , adminController.changePassword)




module.exports = router