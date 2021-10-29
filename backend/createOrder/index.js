const DynamoDB = require('aws-sdk/clients/dynamodb');
const DbUtils = require('../databaseManager');

const tableName = process.env.ECOMMERCE_TABLE_NAME;
const DB = new DynamoDB.DocumentClient();
const dbService = new DbUtils(DB, tableName);

const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const { authenticateToken } = require('../common/authenticateToken');
const uuidv1 = require('uuid/v1');

module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const user = authenticateToken(event.headers);
  const { amount, paymentMethodId, cartItems, shippingData } = JSON.parse(event.body)
  
  try {
      const payment = await processPayment(amount, paymentMethodId);
      await createOrder(cartItems, shippingData, amount, payment, user);

      callback(null, {
          statusCode: 200,
          body: "Successful payment",
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          }
      });

  } catch (e) {
    console.log(e);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify(e.message),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      }
    })
  }
};

async function processPayment(amount, paymentMethodId){
  try{
    const payment = await stripe.paymentIntents.create({ amount: amount, currency: 'CAD', payment_method: paymentMethodId, confirm: true });
    return payment;
  }
  catch(e) {
    console.log(e);
    throw(new Error("Card declined."))
  }
}

async function createOrder(cartItems, shippingData, amount, payment, user){
  try {
    const orderId = uuidv1();
    await addOrderData(orderId, shippingData, amount, payment, user);
    await addOrderItems(orderId, cartItems)
    sendConfirmationEmail();
  }
  catch(error){
    console.log(error);
    await stripe.refunds.create({ payment_intent: payment.id });
    throw( new Error("Something went wrong. Please try again."));
  }
}

async function addOrderData(orderId, shippingData, amount, payment, user){
  let pk = ""
  if(user?.email){
    pk = user.email
  }
  else{
    pk = shippingData.email;
  }

  const orderData = {
    PK: pk, 
    SK: `order#${orderId}`,
    orderId: orderId,
    status: 'paid',
    createdAt: payment.created,
    amount: amount,
    email: shippingData.email,
    firstName: shippingData.firstName,
    lastName: shippingData.lastName,
    address: shippingData.address1,
    city: shippingData.city,
    province: shippingData.province,
    zip: shippingData.zip,
    paymentId: payment.id,
  };

  await dbService.putItem(orderData);
}

async function addOrderItems(orderId, cartItems){
  console.log(cartItems);
  for(cartItem of cartItems) {
    const orderItem = {
      PK: `orderItem#${orderId}`,
      SK: `orderItem#${cartItem.productId}`,
      orderId: orderId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      name: cartItem.name,
    }

    await dbService.putItem(orderItem);
  }
}

function sendConfirmationEmail(){}