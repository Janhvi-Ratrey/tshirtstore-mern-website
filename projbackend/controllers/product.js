const Product = require("../models/product");
const formidable = require("formidable");
const _ =require("lodash");
const fs = require("fs");

//product ID middleware
exports.getProductById = (req, res, next, id) => {

    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "product not found"
            });
        }
        req.product = product;
        next();
    });

};

//create controller
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "issues found with image"
            })
        }

        //destructuring the fields
          const {name, description, price, category, stock} = fields;

          if( !name || !description || !price || !category || !stock){
              return res.status(400).json({
                  error : "please include all fields"
              })
          }


        //restrictions on fields
        let product = new Product(fields);

        //handle file
        if(file.photo){
            if(file.photo.size> 3000000){
                return res.status(400).json({
                    error: "file size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: "saving file to database failed"
                })
            }
            res.json(product);
        })
    })
}


//read controller
exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

//middleware for optimization while loading photo
exports.photo = (req,res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type" , req.product.photo.contentType);
        return res.send(req.product.photo.data);

    }
    next();
}

//delete controller
exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
      if(err){
          return res.status(400).json({
              error : "unable to delete product"
          })
      }
      res.json({
          message : `${product.name} succesfully deleted`
      });
  });

};


//update controller
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "issues found with image"
            })
        }

      


       
        let product = req.product;
        product = _.extend(product , fields)

        //handle file
        if(file.photo){
            if(file.photo.size> 3000000){
                return res.status(400).json({
                    error: "file size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: `updation of ${product.name} product failed`
                })
            }
            res.json(product);
        })
    })
    
}

//listing controller
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ?  req.query.sortBy : "_id"
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy , "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error : "no product found"
            })
        }
        res.json(products);
    })
}

//inventory updation middleware

exports.updateStock = (req, res) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne : {
                filter : {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        };
    });
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "bulk updation failed"
            })
        }
        next();
    });
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err,category) => {
        if(err){
            return res.status(400).json({
                error: "no category found"
            });
        }
        res.json(category);
    });
};