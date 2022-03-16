const userModel = require("../models/userModel");
const objectId = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
	const users = await userModel.find().select("-password");
	res.status(200).json(users);
};
module.exports.userInfo = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send("ID unknown : " + req.params.id);

	userModel.findById(req.params.id, (err, docs) => {
		if (!err) res.send(docs);
		else console.log("ID unknown : " + err);
	}).select("-password");
};
module.exports.updateUser = async (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).json("Id unknown :" + req.params.id);

	try {
		await userModel
			.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$set: { bio: req.body.bio },
				},
				// { new: true, upsert: true, setDefaultsOnInsert: true },
			)
			.then((data) => res.json(data))
			.catch((err) => res.status(500).json({ message: err }));
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.deleteUser = async (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).json("Id unknown : " + req.params.id);

	try {
		await userModel.deleteOne({ _id: req.params.id });
		res.status(200).json("Id removed : " + req.params.id);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};
//to be check
module.exports.follow = (req, res) => {
	if (
		!objectId.isValid(req.params.id) ||
		!objectId.isValid(req.body.idToFollow)
	)
		return res.status(400).json("ID unknown : " + req.params.id);

	try {
		// add to the follower list
		userModel
			.findOneAndUpdate(
				{ _id: req.params.id },
				{ $addToSet: { following: req.body.idToFollow } },
			)
			.then((data) => res.json(data))
			.catch((err) => res.status(500).json({ message: err }));
		// add to following list
		userModel.findOneAndUpdate(
				{ _id: req.body.idToFollow },
				{ $addToSet: { followers: req.params.id } },
			)
			.then((data) => res.json(data))
			.catch((err) => res.status(500).json({ message: err }));
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
//to be Check
module.exports.unfollow = (req, res) => {
	if (
		!objectId.isValid(req.params.id) ||
		!objectId.isValid(req.body.idToUnfollow)
	)
		return res.status(400).json("ID unknown : " + req.params.id);

	try {
		userModel.findOneAndUpdate(
				{ _id: req.params.id },
				{ $pull: { following: req.body.idToUnfollow } },
			)
			.then((data) => res.json(data))
			.catch((err) => res.status(500).json({ message: err }));
		userModel.findOneAndUpdate(
				{ _id: req.body.idToUnfollow },
				{
					$pull: { followers: req.params.id },
				},
			)
			.then((data) => res.json(data))
			.catch((err) => res.status(400).json({ message: err }));
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
