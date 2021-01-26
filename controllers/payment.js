const stripe = require('stripe')(process.env.secretStripeKey);

const payment = async (req, res) => {
  const { buyerEmail, stripeToken, buyerName, buyerAddress, amount } = req.body

  const token = await stripe.tokens.create({
    card: {
      number: '4242424242424242',
      exp_month: 1,
      exp_year: 2022,
      cvc: '314',
    },
  })

  stripe.customers.create({
    email: buyerEmail,
    source: token.id,
    name: buyerName,
    address: buyerAddress
  })
      .then((customer) => {
        return stripe.charges.create({
          amount: amount,
          description: 'File system payment',
          currency: 'USD',
          customer: customer.id
        })
      })
      .then((charge) => {
        res.send({
          success: true,
          error: charge
        })
      })
      .catch((err) => {
        res.send({
          success: false,
          error: err
        })
      })
}

module.exports = {
  payment
}