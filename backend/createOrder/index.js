const DynamoDB = require('aws-sdk/clients/dynamodb');
const DbUtils = require('../databaseManager');

const tableName = process.env.ECOMMERCE_TABLE_NAME;
const DB = new DynamoDB.DocumentClient();
const dbService = new DbUtils(DB, tableName);

const SQS = require('aws-sdk/clients/sqs');
const sqs = new SQS();
const queueUrl = process.env.SEND_CONFIRMATION_URL;

const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const { authenticateToken } = require('../utils/authenticateToken');
const { v1: uuidv1 } = require('uuid');

module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const orderId = uuidv1();
  const user = authenticateToken(event.headers);
  const { amount, paymentMethodId, cartItems, shippingData } = JSON.parse(event.body)
  
  try {
      const payment = await processPayment(amount, paymentMethodId);
      await createOrder(orderId, cartItems, shippingData, amount, payment, user);
      await sendConfirmationEmail(orderId, shippingData);

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

async function createOrder(orderId, cartItems, shippingData, amount, payment, user){
  try {
    await addOrderData(orderId, shippingData, amount, payment, user);
    await addOrderItems(orderId, cartItems);
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
    address: shippingData.address,
    city: shippingData.city,
    province: shippingData.province,
    zip: shippingData.zip,
    paymentId: payment.id,
  };

  await dbService.putItem(orderData);
}

async function addOrderItems(orderId, cartItems){
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

async function sendConfirmationEmail(orderId, shippingData) {
 const orderConfirmation = shippingData;
 orderConfirmation.orderId = orderId;

  try {
    const params = {
      MessageBody: JSON.stringify(orderConfirmation),
      QueueUrl: queueUrl,
    };
    await sqs.sendMessage(params).promise();
  }
  catch (e) {
    console.log(e);
  }
}