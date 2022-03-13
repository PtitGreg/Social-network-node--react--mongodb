const mongoose = require("mongoose");

mongoose
	.connect(
		process.env.MONGODB,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	)
	.then(() => {
		console.log("Connected to mongodb");
	})
	.catch((err) => {
		console.log("Failed to connect to mongodb: " + err);
	});
