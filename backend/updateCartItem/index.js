const DynamoDB = require('aws-sdk/clients/dynamodb');
const DbUtils = require('../databaseManager');

const tableName = process.env.ECOMMERCE_TABLE_NAME;
const DB = new DynamoDB.DocumentClient();
const dbService = new DbUtils(DB, tableName);

const { authenticateToken } = require('../utils/authenticateToken');

module.exports.handler = async (event, context, callback) => {
    const user = authenticateToken(event.headers);
    try {

        if(user) {
            const cartItem = JSON.parse(event.body);
            await updateCartItem(user.email, cartItem);

            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }
            });
        }
        callback(null, {
            statusCode: 401,
            body: JSON.stringify("Unauthorized"),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        });
    
    } 
    catch (e) {
        console.log(e);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify("Request failed"),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        });
    }
};

async function updateCartItem(email, cartItem){
    const key = {PK: email, SK: `cart#${cartItem.productId}`};
    const expression =  'SET #productId = :productId, #name = :name, #image = :image, #price = :price ADD #quantity :quantity';
    const names = {
        '#productId': 'productId',
        '#name': 'name',
        '#price': 'price',
        '#quantity': 'quantity',
        '#image': 'image'
    };
    const values = {
        ':productId': cartItem.productId,
        ':name': cartItem.name,
        ':price': cartItem.price,
        ':quantity': cartItem.quantity,
        ':image': cartItem.image,
    };

    await dbService.updateItem(expression, key, names, values);
}