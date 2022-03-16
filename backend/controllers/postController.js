const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const objectId = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res, next) => {
	postModel.find((err, docs) => {
		!err ? res.send(docs) : console.log("error get data" + err);
	}).sort({createdAt: -1});
};

module.exports.createPost = async (req, res) => {
	const newPost = new postModel({
		posterId: req.body.posterId,
		message: req.body.message,
		video: req.body.video,
		likers: [],
		comments: [],
	});

	try {
		const post = await newPost.save();
		return res.status(201).json(post);
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.updatePost = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send("ID unknown : " + req.params.id);

	postModel.findOneAndUpdate(
		{ id: req.params.id },
		{ $set: { message: req.body.message } },
		(err, docs) => {
			if (!err) res.send(docs);
			else console.log("Update error : " + err);
		},
	);
};

module.exports.deletePost = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send("ID unknown : " + req.params.id);

	postModel.findOneAndDelete({ id: req.params.id }, (err, docs) => {
		if (!err) res.send(docs);
		else console.log("Delete error : " + err);
	});
};
//to be Check

module.exports.likePost = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send("ID unknown : " + req.params.id);

	try {
		postModel.findOneAndUpdate(
			req.params.id,
			{
				$addToSet: { likers: req.body.id },
			},
			(err, docs) => {
				if (err) return res.status(400).send(err);
			},
		),
			userModel.findOneAndUpdate(
				req.body.id,
				{
					$addToSet: { likes: req.params.id },
				},
				(err, docs) => {
					if (!err) res.send(docs);
					else return res.status(400).send(err);
				},
			);
	} catch (err) {
		return res.status(400).send(err);
	}
};
//to be Check

module.exports.unlikePost = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send("ID unknown : " + req.params.id);

	try {
		postModel.findOneAndUpdate(
			req.params.id,
			{
				$pull: { likers: req.body.id },
			},
			// { new: true },
			(err, docs) => {
				if (err) return res.status(400).send(err);
			},
		);
		userModel.findOneAndUpdate(
			req.body.id,
			{
				$pull: { likes: req.params.id },
			},
			{ new: true },
			(err, docs) => {
				if (!err) res.send(docs);
				else return res.status(400).send(err);
			},
		);
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.commentPost = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send("ID unknown :" + req.params.id);

	try {
		return postModel.findOneAndUpdate(
			req.params.id,
			{
				$push: {
					comments: {
						commenterId: req.body.commenterId,
						commenterPseudo: req.body.commenterPseudo,
						text: req.body.text,
						timestamp: new Date().getTime(),
					},
				},
			},
			// { new: true },
			(err, docs) => {
				if (!err) return res.send(docs);
				else return res.status(400).send(err);
			},
		);
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.editCommentPost = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send("ID unknown : " + req.params.id);

	try {
		return postModel.findById(req.params.id, (err, docs) => {
			const theComment = docs.comments.find((comment) =>
				comment._id.equals(req.body.commentId),
			);

			if (!theComment) return res.status(404).send("Comment not found");
			theComment.text = req.body.text;

			return docs.save((err) => {
				if (!err) return res.status(200).send(docs);
				return res.status(500).send(err);
			});
		});
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.deleteCommentPost = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send("ID unknown : " + req.params.id);

	try {
		return postModel.findOneAndUpdate(
			req.params.id,
			{
				$pull: {
					comments: {
						_id: req.body.commentId,
					},
				},
			},
			{ new: true },
			(err, docs) => {
				if (!err) return res.send(docs);
				else return res.status(400).send(err);
			},
		);
	} catch (err) {
		return res.status(400).send(err);
	}
};
