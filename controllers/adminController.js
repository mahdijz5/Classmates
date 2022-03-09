const sharp = require("sharp");
const multer = require("multer");
const shortId = require("short-id");
const bcrypt = require('bcrypt')
const { fileFilter } = require("../utils/multer");
const {convertDate} = require('../utils/convertDate');

const fs = require('fs');

const appRoot = require("app-root-path");

const Post = require("../model/posts");
const User = require('../model/users');

exports.getDash = async (req, res) => {
	res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
	const user = User.findOne({_id : req.user.id})

	const page =  +req.query.page || 1
	const postPerPage = 8
	
	const numberOfPosts  = await Post.find({status : 'public'}).countDocuments()
	const posts  = await Post.find({user : req.user._id}).sort({
		createdOn: "desc",
	}).skip((page-1 )*postPerPage).limit(postPerPage)
	
	try {
		res.set(
			"Cache-Control",
			"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
		);
		res.render("admin/dashboard", {
			req,
			posts,
			convertDate,
			pageTitle: "Dashboard | Admin panel",
			layout: "admin/layouts/dashLayout",
			path: "/dashboard",
			currentPage : page ,
			numberOfPosts,
			previousPage: page-1,
			nextPage : page+1,
			hasNextPage: (postPerPage * page) < numberOfPosts,
            hasPreviousPage: page != 1,
			lastPage : Math.ceil(numberOfPosts / postPerPage),
		});
	} catch (err) {
		console.log(err);
	}
};

exports.handleSearch = async (req,res) => {
	const page =  +req.query.page || 1
	const postPerPage = 8
	
	const numberOfPosts  = await Post.find({status : 'public' , $text : {$search : req.body.search}}).countDocuments()
	const posts  = await Post.find({user : req.user._id , $text : {$search : req.body.search}}).sort({
		createdOn: "desc",
	}).skip((page-1 )*postPerPage).limit(postPerPage)
	
	try {
		res.render("admin/dashboard", {
			req,
			posts,
			convertDate,
			pageTitle: "Dashboard | Admin panel",
			layout: "admin/layouts/dashLayout",
			path: "/dashboard",
			currentPage : page ,
			numberOfPosts,
			previousPage: page-1,
			nextPage : page+1,
			hasNextPage: (postPerPage * page) < numberOfPosts,
            hasPreviousPage: page != 1,
			lastPage : Math.ceil(numberOfPosts / postPerPage),
		});
	} catch (err) {
		console.log(err);
	}
}

exports.getAddPost = (req, res) => {
	res.render("admin/addPost", {
		req,
		pageTitle: "Create post",
		path: "/addPost",
		layout: "admin/layouts/dashLayout",
	});
};

exports.uploadImg = (req, res) => {
	const upload = multer({
		limits: { fileSize: 4000000 },
		fileFilter,
	}).single("image");

	upload(req, res, async (err) => {
		if (err) {
			console.log(err);
		} else {
			const fileName = `${shortId.generate()}_${req.files.image.name}.jpeg`;
			if (req.files) {
				if (req.files.image.size > 40000000) {
					res.status(400).send("You cant upload image with at least 4mb size");
				} else {
					await sharp(req.files.image.data)
						.jpeg({ quality: 60 })
						.toFile(`public/uploads/${fileName}`)
						.catch((err) => console.log(err));
					res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
				}
			} else {
				res.status(400).send("Please Choose an image");
			}
		}
	});
};

exports.newPost = async (req, res) => {
	const errors = {};
	const thumbnail = req.files ? req.files.thumbnail : {};
	const thumbnailName = `${shortId.generate()}_${thumbnail.name}`;
	const thumbnailPath = `${appRoot}/public/uploads/thumbnail/${thumbnailName}`;
	try {
		req.body = { ...req.body, thumbnail };

		await Post.postValidation(req.body);

		await sharp(thumbnail.data)
			.jpeg({ quality: 60 })
			.toFile(thumbnailPath)
			.catch((err) => {
				console.log(err);
			});

		await Post.create({
			...req.body,
			user: req.user._id,
			thumbnail: thumbnailName,
		});

		res.redirect("/admin/dashboard");
	} catch (err) {
		console.log(err);
		errors["errors"] = err.errors;

		res.render("admin/addPost", {
			req,
			pageTitle: "Create post",
			path: "/addPost",
			layout: "admin/layouts/dashLayout",
			errors: errors.errors,
		});
	}
};

exports.getEditPost = async(req,res) => {
	const post = await Post.findOne({_id : req.params.id})
	
	try {

		if(post.user.toString() != req.user._id) {
			return res.redirect('/404')
		}

		return res.render('admin/edit' , {
			req,
			pageTitle : 'Edit Post',
			path : '/edit',
			post,
			layout: "admin/layouts/dashLayout",
		})
	} catch (err) {
		console.log(err);
	}
}

exports.editPost = async (req,res) => {
	const errors = {};
	const thumbnail = req.files ? req.files.thumbnail : {};
	const thumbnailName = `${shortId.generate()}_${thumbnail.name}`;
	const thumbnailPath = `${appRoot}/public/uploads/thumbnail/${thumbnailName}`;
	const post = await Post.findOne({_id : req.params.id})
	console.log(post);
	console.log(req.params.id);
	try {

		if(post.user.toString() != req.user._id) {
			return res.redirect('/404')
		}
		
		if(thumbnail.name) {
			fs.unlink(`${appRoot}/public/uploads/thumbnail/${post.thumbnail}`,async (err) => {
				if(err) console.log(err)
				else {
					await sharp(thumbnail.data).jpeg({quality : 60}).toFile(thumbnailPath)
				}
			})

			await Post.postValidation({...req.body , thumbnail})
		}else {
			await Post.postValidation({...req.body ,thumbnail: {size : 1 , name : 'PlaceHolder' , mimeType : 'png'} })
		}


		const {title , body , status } =await  req.body

		post.title =  title
		post.body =  body
		post.status =   status
		post.thumbnail = thumbnail.name ? thumbnailName : post.thumbnail

		await post.save()

		res.redirect('/admin/dashboard')

	} catch (err) {
		console.log(err);
		errors["errors"] = err.errors;

		res.render("admin/edit", {
			req,
			pageTitle : 'Edit Post',
			path : '/edit',
			post,
			layout: "admin/layouts/dashLayout",
			errors: errors.errors,
		});
	}
}

exports.deletePost = async (req,res) => {
	const post = await Post.findOne({_id : req.params.id})
	try {

		if(post.user.toString() != req.user._id) {
			return res.redirect('/404')
		}

		fs.unlink(`${appRoot}/public/uploads/thumbnail/${post.thumbnail}`,async (err) => {
			if(err) console.log(err)
		})
		post.remove()
		
		res.redirect('/admin/dashboard')
	} catch (err) {
		console.log(err)
	}
}

exports.setting = async(req,res) => {
	res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
	res.render('admin/setting.ejs' , {
		req,
		pageTitle : 'setting',
		path : '/setting',
		convertDate,
		layout: "admin/layouts/dashLayout",
	})
}

exports.changeProfile = async (req, res) => {
	res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    const errors ={};

    const profileImg = req.files ? req.files.profileImg : {}
    const profileImgName = `${shortId.generate()}_${profileImg.name}`;
    const uploadPath = `${appRoot}/public/uploads/profile/${profileImgName}`

    const user = await User.findOne({ _id: req.user.id })

    try {
        if (!user) {
            return res.redirect('/404')
        }

        if (profileImg.name){
            await User.userValidation({ ...req.body, profileImg,confirmPassword : req.body.password,oldPassword:123456 });
            await sharp(profileImg.data).jpeg({ quality: 60 }).resize(200, 200).toFile(uploadPath).catch((err) => 
			console.log(err + 'from sharp'))
			if(req.user.profileImg != 'placeholder.png'){
            fs.unlink(`${appRoot}/public/uploads/profile/${user.profileImg}`, (err) => {
                if (err) console.log(err);
            })
			}
        } else {
            await User.userValidation({ ...req.body,profileImg,confirmPassword : req.body.password,oldPassword:123456 })
        }


        const { username, password } = req.body
        const isMatch = await bcrypt.compare(password, req.user.password)
        const userExist = await User.findOne({ username })

        //* Check Oldpassword & Email 
        if (!isMatch) {
            req.flash('error', 'رمز گذشته خود را اشتباه وارد کردید')
			return res.redirect('/admin/setting')
        }
        if (userExist) {
            if (userExist.email != user.email) {
                req.flash('error', "ایمیل  مشابه ایی وجود دارد")
				return res.redirect('/admin/setting')
            }
        }

        //* profileImg 
        user.username = username;
        console.log(profileImgName);
        user.profileImg = profileImg.name ? profileImgName : user.profileImg

        await user.save()
        return res.redirect('/admin/setting')

    } catch (err) {
        console.log(err);
		errors["errors"] = err.errors;

		res.render("admin/setting", {
			error : req.flash("error"),
			req,
			pageTitle : 'Setting',
			path : '/setting',
			convertDate,
			layout: "admin/layouts/dashLayout",
			errors: errors.errors,
		});
    }
}


exports.changePassword = async(req,res,next) => {
	res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    let errors ={}
    try {
        const {oldPassword,password,confirmPassword} = req.body

        const user = await User.findOne({ _id: req.user.id })
        const isMatch = await bcrypt.compare(oldPassword,user.password)

        if(!isMatch) {
            req.flash('error','رمز عبور گذشته اشتباه میباشد')
            return res.redirect('/dashboard/setting')
        }

        await User.userValidation({...req.body,username : user.username})
        
    if(password!=confirmPassword) {
        req.flash('error','رمز عبور مشابه نیست')
        return res.redirect('/admin/setting')
    }

    user.password =password
    await user.save()
	return res.redirect('/admin/setting')

    } catch (err) {
        console.log(err);
		errors["errors"] = err.errors;

		res.render("admin/setting", {
			error : req.flash("error"),
			req,
			pageTitle : 'Setting',
			path : '/setting',
			convertDate,
			layout: "admin/layouts/dashLayout",
			errors: errors.errors,
		});
    }
}

