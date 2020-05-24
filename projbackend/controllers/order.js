const {ProductCart , Order } = require("../models/order");
//ID param controller
exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error : "no order found"
            });
        }
        req.order=order;
        next();

    })
}

//create controller
exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error : "unable to save order in database"
            })
        }
        res.json(order);
    });
};

//read controller
exports.getAllOrders = (req,res) => {
    Order.find().populate("user", "_id name")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error : "no orders found"
            })
        }
        res.json(order);
    });
};

//order status controllers
exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
    Order.update(
        {_id :req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err){
                return res.status(400).json({
                    error : "cannot update order status"
                });
            }
            res.json(order);
        }
    )
};