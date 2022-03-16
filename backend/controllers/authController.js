const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/errorsUtils");

const ageMax = 86400000; //24h

const createToken = (id) => {
	return jwt.sign({ id }, process.env.TOKEN_SECRET, {
		expiresIn: "24h",
	});
};

module.exports.signUp = async (req, res) => {
	const { pseudo, email, password } = req.body;

	try {
		const user = await UserModel.create({ pseudo, email, password });
		res.status(201).json({ user: user._id });
	} catch (err) {
		const errors = signUpErrors(err)
		res.status(400).json({ errors });
	}
};

module.exports.signIn = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await UserModel.login(email, password);
		const token = createToken(user._id);
		res.cookie("jwt", token, { httpOnly: true, maxAge: `${ageMax}` }); //24h
		res.status(200).json({ user: user._id });
	} catch (err) {
		const errors = signInErrors(err);
		res.status(500).json({ errors });
	}
};

module.exports.logout = (req, res) => {
	res.clearCookie();
	res.send("Cookie supprimé avec succès");
};
