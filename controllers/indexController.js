const Post = require("../model/posts");
const User = require("../model/users");
const Comment = require("../model/comments");
const ReplyComment = require("../model/replyComments");

const { auth, notAuth } = require("../middleWares/auth");
const { convertDate } = require("../utils/convertDate");
const comments = require("../model/comments");
const truncate = require("truncate");
exports.getIndex = async (req, res) => {
	const statusUser = notAuth(req, res);

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
			auth: statusUser,
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
	const statusUser = notAuth(req, res);

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
			auth: statusUser,
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
	const statusUser = notAuth(req, res);

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
			auth: statusUser,
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
	const statusUser = notAuth(req, res);
	
	try {
		let liked = false;
		const post = await Post.findOne({ _id: req.params.id }).populate("user");

		//!Comments
		const comments = await Comment.find({ post: req.params.id })
			.populate("user")
			.populate("post")
			.sort({
				date: "desc",
			})
			.limit(6);
		const replyComments = await ReplyComment.find({ show: true })
			.populate("comment")
			.populate("user");
		if (!post) {
			return res.redirect("/404");
		}

		//!SideBar
		const sidebarPost = await Post.find({ status: "public" })
			.sort({
				date: "desc",
			})
			.limit(6);
		//!Count views
		if (req.isAuthenticated() == true) {

			//!liked or no
			for (l of post.likedBy) {
				if (l.toString() == req.user._id.toString()) {
					liked = true;
				}
			}

			let seen = false;

			for (v of post.viewedBy) {
				if (v.toString() == req.user._id.toString()) seen = true;
			}
			if (seen == false) {
				post.views++;
				post.viewedBy.push(req.user._id);
				post.save();
			}
		}

		res.render("post", {
			auth: statusUser,
			comments: comments ? comments : {},
			sidebarPost,
			pageTitle: "Post",
			path: "/post",
			post,
			convertDate,
			replyComments,
			liked,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.handleSearch = async (req, res) => {
	const statusUser = notAuth(req, res);

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
			auth: statusUser,
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
	const statusUser = notAuth(req, res);

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
		post.commentsNum++;
		post.save();
		res.redirect(`/post/${req.params.id}`);
	} catch (err) {
		console.log(err);
		errors["errors"] = err.errors;

		res.render("post", {
			auth: statusUser,
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
	const commentID = req.params.id;

	const comment = await Comment.findOne({ _id: commentID });

	try {
		if (!comment) {
			return res.redirect("/404");
		}

		const { text } = await req.body;

		await ReplyComment.replyCommentValidation({
			text,
			comment: commentID,
		});

		await ReplyComment.create({
			text,
			comment: commentID,
			user: req.user._id,
		});

		res.redirect(`back`);
	} catch (err) {
		console.log(err);
		res.redirect(`back`);
	}
};

exports.profile = async (req, res) => {
	const statusUser = notAuth(req, res);

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
			user: user.id,
			status: "public",
		}).countDocuments();
		const posts = await Post.find({ user: user.id, status: "public" })
			.sort({
				date: "desc",
			})
			.skip((page - 1) * postPerPage)
			.limit(postPerPage);

		res.render("profile", {
			truncate,
			auth: statusUser,
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

exports.getLikes = async (req, res) => {
	try {
		const postID = req.params.id;
		const post = await Post.findOne({ _id: req.params.id });

		if (req.isAuthenticated() == true) {
			let liked = false;

			if (post.likedBy.length > 0) {
				for (l of post.likedBy) {
					if (l.toString() == req.user._id.toString()) {
						liked = true;
					}

					if (liked == false) {
						post.likes++;
						post.likedBy.push(req.user._id);
						post.save();
					} else {
						post.likes--;
						post.likedBy = post.likedBy.filter(
							(p) => p.toString() != req.user._id.toString()
						);
						post.save();
					}
				}
			} else {
				post.likes++;
				post.likedBy.push(req.user._id);
				post.save();
			}
		}
	} catch (error) {
		console.log(error);
	}
};
