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
