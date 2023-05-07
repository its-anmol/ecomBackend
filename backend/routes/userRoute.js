const express=require("express");
const { registerUser, loginUser, logout, forgetPassword, resetPassword, getUserDetail, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser} = require("../controllers/userController");
const { isAuthenicatedUser, authorizeRoles } = require("../middleware/auth");

const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forget").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenicatedUser,updatePassword)

router.route("/me").get(isAuthenicatedUser,getUserDetail)
router.route("/me/update").put(isAuthenicatedUser,updateProfile)

router.route("/admin/getalluser").get(isAuthenicatedUser,authorizeRoles("admin"),getAllUser)
//router.route("/admin/getuser/:id").get(getSingleUser)

router
    .route("/admin/user/:id")
    .get(isAuthenicatedUser,authorizeRoles("admin"),getSingleUser)
    .put(isAuthenicatedUser,authorizeRoles("admin"),updateUserRole)
    .delete(isAuthenicatedUser,authorizeRoles("admin"),deleteUser)

module.exports=router