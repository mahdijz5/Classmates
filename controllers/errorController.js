const {auth, notAuth} = require('../middleWares/auth')
const Post = require('../model/posts')
exports.get404 = async (req, res) => {
	const statusUser = notAuth(req,res)
	const sidebarPost = await Post.find({status : 'public'}).sort({
		createdOn : 'desc'               
	}).limit(6)

	try {
		res.status(404).render('errors/404',{
			auth : statusUser,
            pageTitle : '404',
            path : '/404',
            sidebarPost,
            text : '404 : صفحه مورد نظر یافت نشد'
        })
	} catch (err) {
		console.log(err);
    }
};

exports.get500 = async (req, res) => {
	const statusUser = notAuth(req,res)
	const sidebarPost = await Post.find({status : 'public'}).sort({
		createdOn : 'desc'               
	}).limit(6)

	try {
		res.status(500).render('errors/500',{
			auth : statusUser,
            pageTitle : '500',
            path : '/404',
            sidebarPost,
            text: '500 : خطای از سمت سرور رخ داده است '
        })
	} catch (err) {
		console.log(err);
    }
};