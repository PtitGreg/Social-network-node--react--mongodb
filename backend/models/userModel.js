const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		pseudo: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 55,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			validate: [isEmail],
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
			max: 1024,
		},
		picture: {
			type: String,
			default: "images/",
		},
		bio: {
			type: String,
			max: 1024,
		},
		followers: {
			type: [String],
		},
		following: {
			type: [String],
		},
		likes: {
			type: [String],
		},
	},
	{
		timestamps: true,
	},
);
userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});
module.exports = mongoose.model("user", userSchema);
