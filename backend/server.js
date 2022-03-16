const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes")
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth  } = require("./middleware/authMiddleware");
const app = express();

require("dotenv").config({ path: "./config/.env" });
require("./config/database");

app.use(express.json());
app.use(cookieParser());

//jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
	res.status(200).json(res.locals.user._id)
})

//Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

//Server
app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});
