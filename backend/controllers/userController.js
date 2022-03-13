const userModel = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
	const users = await userModel.find().select("-password");
	res.status(200).json(users);
};
module.exports.userInfo = (req, res) => {
	console.log("req: ", req.params);
	!ObjectId.isValid(req.params.id)
		? res.status(400).send("ID unknow: " + req.params.id)
		: userModel
				.findById(req.params.id, (err, docs) => {
					!err ? res.send(docs) : console.log("ID unknow :" + err);
				})
				.select("-password");
};
module.exports.updateUser = async (req, res) => {
	if (!ObjectId.isValid(req.params.id))
		return res.status(400).send("Id unknown :" + req.params.id);

	try {
		await userModel
			.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$set: { bio: req.body.bio },
				},
				{ new: true, upsert: true, setDefaultsOnInsert: true },
			)
			.then((data) => res.send(data))
			.catch((err) => res.status(500).send({ message: err }));
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
module.exports.deleteUser = async (req, res) => {
	if (!ObjectId.isValid(req.params.id))
		return res.status(400).send("Id unknown : " + req.params.id);

	try {
		await userModel.remove({ _id: req.params.id }).exec();
		res.status(200).json("Id removed : " + req.params.id);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};
module.exports.follow = async (req, res) => {
	if (!ObjectId.isValid(req.params.id))
		return res.status(400).send("Id unknown :" + req.params.id);

	try {
		await userModel.findByIdAndUpdate(req.params.id),
			{ $addToSet: { following: req.body.idToFollow } },
			{ new: true, upsert: true },
			(err, docs) => {
				!err ? res.statut
		}
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
