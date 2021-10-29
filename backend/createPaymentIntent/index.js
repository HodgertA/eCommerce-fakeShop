const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const { amount } = JSON.parse(event.body);
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'cad',
            payment_method_types: ['card'],
        });
      
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({clientSecret: paymentIntent.client_secret}),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        });

    } catch (e) {
      console.log(e);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify("Could not create user."),
      })
    }
  };
