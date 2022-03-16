const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		posterId: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		picture: {
			type: String,
		},
		video: {
			type: String,
		},
		likers: {
			type: [String],
			require: true,
		},
		comments: {
			type: [
				{
					commenterId: String,
					commenterPseudoId: String,
					text: String,
					timestamp: Number,
				},
			],
			require: true,
		},
	},
	{
		timestamp: true,
	},
);
module.exports = mongoose.model("post", postSchema)
