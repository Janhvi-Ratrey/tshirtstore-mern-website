const express = require("express");
const router = express.Router();
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {updateStock} = require("../controllers/product");
const {getOrderById, createOrder, getAllOrders, updateStatus, getOrderStatus} = require("../controllers/order");


//PARAMS
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Routes
//create
router.post("/order/create/:userId", isSignedIn, isAuthenticated, isAdmin, pushOrderInPurchaseList, updateStock, createOrder);

//read
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders);

//order status
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;