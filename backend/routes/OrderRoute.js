const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenicatedUser,authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenicatedUser,newOrder);

router.route("/order/:id").get(isAuthenicatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenicatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenicatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenicatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenicatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;