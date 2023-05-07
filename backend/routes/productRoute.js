const express=require("express");
const { getAllProduct,updateProduct, deleteProduct, getProductDetail, createProductReview, getProductReviews, deleteReview, createProduct } = require("../controllers/productcontroller");
const { isAuthenicatedUser,authorizeRoles } = require("../middleware/auth");
const router=express.Router();

router.route("/products").get(getAllProduct);

// router.route("admin/product/new").post(createProduct);
// isAuthenicatedUser,authorizeRoles("admin"),
router
  .route("/admin/product/new")
  .post(isAuthenicatedUser, authorizeRoles("admin"),createProduct);

router
    .route("/admin/product/:id")
    .put(isAuthenicatedUser,authorizeRoles("admin"),updateProduct)
    .delete(isAuthenicatedUser,authorizeRoles("admin"),deleteProduct)

router.route("/product/:id")
    .get(isAuthenicatedUser,getProductDetail)


router.route("/review") 
    .put(isAuthenicatedUser,createProductReview)
    .delete(isAuthenicatedUser, deleteReview)
    .get(getProductReviews);

module.exports=router