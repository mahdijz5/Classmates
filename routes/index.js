const {Router} = require('express');

const router = new Router()

const indexController = require('../controllers/indexController'); 

const {auth} = require('../middleWares/auth');

// @route GET /
// @desc Get home page
router.get('/',indexController.getIndex)

// @route Get /grade
//@desc Get post by grade
router.get('/grade',indexController.getPostsByGrade)

// @route Get /book
//@desc Get post by book name
router.get('/book',indexController.getPostsByBookName)

// @route Get /post/:id
//@desc get single post
router.get('/post/:id',indexController.getPost)

// @route Get /post/:id
//@desc get single post
router.post('/post/like/:id',indexController.getLikes)

// @route POST /post/comments
//@desc create new comment
router.post('/post/comments/:id',auth,indexController.createComments)


//@router POST /post/reply/:id
//@desc handle reply
router.post('/post/reply/:id',auth ,indexController.replyComments)

// @route POST /search
//@desc handle search bar
router.post('/search',indexController.handleSearch)

// @route POST /profile/:id
//@desc show the user profile
router.get('/profile/:id',indexController.profile)


module.exports = router