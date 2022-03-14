const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

//Auth
router.post("/register", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout)

//User display
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

module.exports = router;
