var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "jfcybthrfncv2bhw",
  publicKey: "bkbn8qmy9gt48tf9",
  privateKey: "74163acb47284a1a665940c097e48f43"
});


exports.getToken = (req, res) =>{
    gateway.clientToken.generate({}, function (err, response) {
       if(err){
           res.status(500).send(err)
       }else{
           res.send(response)
       }
      });
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFormTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFormTheClient,
        paymentMethodNonce: nonceFromTheClient,
        
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
        if(err){
            res.status(500).send(err)
        }else{
            res.send(result)
        }
      });
}