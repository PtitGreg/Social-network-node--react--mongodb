const userModel = require("../models/userModel");
const objectId = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
	const users = await userModel.find().select("-password");
	res.status(200).json(users);
};
module.exports.userInfo = (req, res) => {
	!objectId.isValid(req.params.id)
		? res.status(400).json("ID unknow: " + req.params.id)
		: userModel
				.findById(req.params.id, (err, data) => {
					!err ? res.json(data) : console.log("ID unknow :" + err);
				})
				.select("-password");
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
				{ new: true, upsert: true, setDefaultsOnInsert: true },
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
		await userModel.remove({ _id: req.params.id }).exec();
		res.status(200).json("Id removed : " + req.params.id);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};
//A revoir
module.exports.follow = async (req, res) => {
	if (
		!objectId.isValid(req.params.id) ||
		!objectId.isValid(req.body.idToFollow)
	)
		return res.status(400).json("ID unknown : " + req.params.id);

	try {
		// add to the follower list
		await userModel
			.findByIdAndUpdate(
				req.params.id,
				{ $addToSet: { followers: req.body.idToFollow } },
				{ new: true, upsert: true, setDefaultsOnInsert: true },
			)
			.then((data) => res.json(data))
			.catch((err) => res.status(500).json({ message: err }));
			// add to following list
			await userModel
				.findByIdAndUpdate(
					req.body.idToFollow,
					{ $addToSet: { following: req.params.id } },
					{ new: true, upsert: true, setDefaultsOnInsert: true },
				)
				.then((data) => res.json(data))
				.catch((err) => res.status(500).json({ message: err }));
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
//A revoir
module.exports.unfollow = async (req, res) => {
	if (
		!objectId.isValid(req.params.id) ||
		!objectId.isValid(req.body.idToUnfollow)
	)
		return res.status(400).json("ID unknown : " + req.params.id);

	try {
		await userModel
			.findByIdAndUpdate(
				req.params.id,
				{ $pull: { followers: req.body.idToUnfollow } },
				// { new: true, upsert: true, setDefaultsOnInsert: true },
			)
			.then((data) => res.json(data))
			.catch((err) => res.status(500).json({ message: err }));
		// remove to following list
		await userModel
			.findByIdAndUpdate(
				req.body.idToUnfollow,
				{ $pull: { following: req.params.id } },
				// { new: true, upsert: true, setDefaultsOnInsert: true },
			)
			.then((data) => res.json(data))
			.catch((err) => res.status(500).json({ message: err }));
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
