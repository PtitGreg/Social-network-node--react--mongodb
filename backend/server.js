const express = require("express");
const userRoutes = require("./routes/userRoutes")
require("dotenv").config({ path: "./config/.env" });
require("./config/database")
const app = express();
app.use(express.json())
app.use("/api/user", userRoutes)
app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});
// app.use((req, res, next) => {
// 	res.setHeader("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
// 	res.setHeader(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
// 	);
// 	res.setHeader(
// 		"Access-Control-Allow-Methods",
// 		"GET, POST, PUT, DELETE, PATCH, OPTIONS",
// 	);
// 	res.setHeader("Access-Control-Allow-Credentials", "true");
// 	next();
// });

