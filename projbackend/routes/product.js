const express = require("express");
const router = express.Router();

const {getProductById, createProduct, getProduct, photo, removeProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//PARAMS
router.param("userId", getUserById);
router.param("productId", getProductById);

//ROUTES
//create
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//read
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo); //for speed optimization

//delete
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated,isAdmin, removeProduct);

//update
router.put("/product/:productId/:userId",isSignedIn, isAuthenticated, isAdmin, updateProduct);

//listing (get all + limitation on number of products you see) 
router.get("/products", getAllProducts);

router.get("/product/categories", getAllUniqueCategories);


module.exports = router;