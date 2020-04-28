const stripe = require("stripe")(process.env.KEY);
const uuid = require("uuid/v4");

exports.makePayment = (req, res) => {
  const { products, token } = req.body;

  const finalAmount = (() => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.price;
    }, 0);
  })();

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: finalAmount,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "description",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
