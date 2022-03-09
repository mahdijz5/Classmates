const Post = require("../model/posts");
const User = require("../model/users");
const Comment = require("../model/comments");

const {auth, notAuth} = require('../middleWares/auth')
const { convertDate } = require("../utils/convertDate");
const comments = require("../model/comments");
const truncate = require('truncate')
exports.getIndex = async (req, res) => {
	
	const statusUser = notAuth(req,res)

	res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
	const page = +req.query.page || 1;
	const postPerPage = 6;

	const numberOfPosts = await Post.find({ status: "public" }).countDocuments();
	const posts = await Post.find({ status: "public" })
		.sort({
			date: "desc",
		})
		.skip((page - 1) * postPerPage)
		.limit(postPerPage);

	const sidebarPost = await Post.find({ status: "public" })
		.sort({
			date: "desc",
		})
		.limit(6);

	try {
		res.render("index", {
			truncate,
			auth : statusUser,
			sidebarPost,
			posts,
			pageTitle: "classmates",
			path: "/",
			currentPage: page,
			numberOfPosts,
			previousPage: page - 1,
			nextPage: page + 1,
			hasNextPage: postPerPage * page < numberOfPosts,
			hasPreviousPage: page != 1,
			lastPage: Math.ceil(numberOfPosts / postPerPage),
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getPostsByGrade = async (req, res) => {
	const statusUser = notAuth(req,res)

	const page = +req.query.page || 1;
	const grade = req.query.grade || "others";
	const postPerPage = 6;

	const numberOfPosts = await Post.find({
		status: "public",
		grade,
	}).countDocuments();
	const posts = await Post.find({ status: "public", grade })
		.sort({
			date: "desc",
		})
		.skip((page - 1) * postPerPage)
		.limit(postPerPage);

	const sidebarPost = await Post.find({ status: "public" })
		.sort({
			date: "desc",
		})
		.limit(6);

	try {
		res.render("index", {
			truncate,
			auth : statusUser,
			posts,
			sidebarPost,
			pageTitle: "Weblog",
			path: "/",
			currentPage: page,
			numberOfPosts,
			previousPage: page - 1,
			nextPage: page + 1,
			hasNextPage: postPerPage * page < numberOfPosts,
			hasPreviousPage: page != 1,
			lastPage: Math.ceil(numberOfPosts / postPerPage),
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getPostsByBookName = async (req, res) => {
	const statusUser = notAuth(req,res)

	const page = +req.query.page || 1;
	const book = req.query.book || "others";
	const postPerPage = 6;

	const numberOfPosts = await Post.find({
		status: "public",
		book,
	}).countDocuments();
	const posts = await Post.find({ status: "public", book })
		.sort({
			date: "desc",
		})
		.skip((page - 1) * postPerPage)
		.limit(postPerPage);

	const sidebarPost = await Post.find({ status: "public" })
		.sort({
			date: "desc",
		})
		.limit(6);

	try {
		res.render("index", {
			truncate,
			auth : statusUser,
			sidebarPost,
			posts,
			pageTitle: "Weblog",
			path: "/",
			currentPage: page,
			numberOfPosts,
			previousPage: page - 1,
			nextPage: page + 1,
			hasNextPage: postPerPage * page < numberOfPosts,
			hasPreviousPage: page != 1,
			lastPage: Math.ceil(numberOfPosts / postPerPage),
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getPost = async (req, res) => {
	const statusUser = notAuth(req,res)

	try {
		const post = await Post.findOne({ _id: req.params.id }).populate("user");
		const comments = await Comment.find({ post: req.params.id })
			.populate("user")
			.sort({
				date: "desc",
			})
			.limit(6);

		if (!post) {
			return res.redirect("/404");
		}
		const sidebarPost = await Post.find({ status: "public" })
			.sort({
				date: "desc",
			})
			.limit(6);

		res.render("post", {
			auth : statusUser,
			comments: comments ? comments : {},
			sidebarPost,
			pageTitle: "Post",
			path: "/post",
			post,
			convertDate,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.handleSearch = async (req, res) => {
	const statusUser = notAuth(req,res)

	const page = +req.query.page || 1;
	const book = req.query.book || "others";
	const postPerPage = 6;

	const numberOfPosts = await Post.find({
		status: "public",
		$text: { $search: req.body.search },
	}).countDocuments();
	const posts = await Post.find({
		status: "public",
		$text: { $search: req.body.search },
	})
		.sort({
			date: "desc",
		})
		.skip((page - 1) * postPerPage)
		.limit(postPerPage);

	const sidebarPost = await Post.find({ status: "public" })
		.sort({
			date: "desc",
		})
		.limit(6);

	try {
		res.render("index", {
			truncate,
			auth : statusUser,
			sidebarPost,
			posts,
			pageTitle: "Weblog",
			path: "/",
			currentPage: page,
			numberOfPosts,
			previousPage: page - 1,
			nextPage: page + 1,
			hasNextPage: postPerPage * page < numberOfPosts,
			hasPreviousPage: page != 1,
			lastPage: Math.ceil(numberOfPosts / postPerPage),
		});
	} catch (err) {
		console.log(err);
	}
};

exports.createComments = async (req, res) => {
	const statusUser = notAuth(req,res)

	let errors = {};
	const postID = req.params.id.toString();
	const post = await Post.findOne({ _id: req.params.id }).populate("user");

	const sidebarPost = await Post.find({ status: "public" })
		.sort({
			date: "desc",
		})
		.limit(6);
	try {
		if (!post) {
			return res.redirect("/404");
		}

		const { text } = await req.body;

		await Comment.commentValidation({
			text,
			post: postID,
		});

		await Comment.create({
			text,
			post: postID,
			user: req.user._id,
		});

		res.redirect(`/post/${req.params.id}`);
	} catch (err) {
		console.log(err);
		errors["errors"] = err.errors;

		res.render("post", {
			auth : statusUser,
			sidebarPost,
			pageTitle: "Post",
			path: "/post",
			post,
			convertDate,
			errors: errors.errors,
		});
	}
};

exports.replyComments = async (req, res) => {
	const statusUser = notAuth(req,res)

	let errors = {};
	const sidebarPost = await Post.find({ status: "public" })
		.sort({
			date: "desc",
		})
		.limit(6);
	try {
		const targetComments = await Comment.findOne({ _id: req.params.id });
		const { text } = await req.body;

		if (!targetComments || targetComments.user.toString() == req.user._id) {
			res.redirect("/404");
		} else {
			await Comment.commentValidation({
				text: targetComments.text,
				post: targetComments.post,
				reply: text,
			});

			targetComments.reply += `
		<div class=" me-4 p-3 d-block" id="comment">
		<div>
			<div class="flex-shrink-0"><img class="rounded-circle" id="commenterProf"
				src="/uploads/profile/${req.user.profileImg}" alt="..." />
			</div>
		<div class="ms-3 mb-3">
			<div class="fw-bold">${req.user.username} </div>
			${text} 
		</div>
		</div>
		</div>
		`;
			await targetComments.save();
			res.redirect(`/post/${targetComments.post}`);
		}
	} catch (err) {
		console.log(err);
		errors["errors"] = err.errors;

		res.render("post", {
			auth : statusUser,
			sidebarPost,
			pageTitle: "Post",
			path: "/post",
			convertDate,
			errors: errors.errors,
		});
	}
};

exports.profile = async (req, res) => {
	const statusUser = notAuth(req,res)

	const sidebarPost = await Post.find({ status: "public" })
		.sort({
			date: "desc",
		})
		.limit(6);
	const page = +req.query.page || 1;
	const postPerPage = 4;

	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) {
			res.redirect("/404");
		}

		const numberOfPosts = await Post.find({
			user: user.id , status : 'public'
		}).countDocuments();
		const posts = await Post.find({ user: user.id , status : 'public' })
			.sort({
				date: "desc",
			})
			.skip((page - 1) * postPerPage)
			.limit(postPerPage);

		res.render("profile", {
			truncate,
			auth : statusUser,
			pageTitle: user.username,
			path: "/profile",
			sidebarPost,
			user,
			posts,
			convertDate,
			currentPage: page,
			numberOfPosts,
			previousPage: page - 1,
			nextPage: page + 1,
			hasNextPage: postPerPage * page < numberOfPosts,
			hasPreviousPage: page != 1,
			lastPage: Math.ceil(numberOfPosts / postPerPage),
		});
	} catch (err) {
		console.log(err);
	}
};