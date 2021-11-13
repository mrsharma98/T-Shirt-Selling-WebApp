const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'bf5nqpmk57bs7d8v',
  publicKey: 'pbzqshmp4rmw345n',
  privateKey: '1421bbc468ae3918f5f1e0416727114c'
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function(err, response) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send(response)
    }
  });
}

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce

  let amountFromTheClient = req.body.amount
  gateway.transaction.sale({
    amount: amountFromTheClient,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.json(result)
    }
  });
}