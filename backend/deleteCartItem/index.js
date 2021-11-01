const DynamoDB = require('aws-sdk/clients/dynamodb');
const DbUtils = require('../databaseManager');

const tableName = process.env.ECOMMERCE_TABLE_NAME;
const DB = new DynamoDB.DocumentClient();
const dbService = new DbUtils(DB, tableName);

const { authenticateToken } = require('../utils/authenticateToken');

module.exports.handler = async (event, context, callback) => {
    const user = authenticateToken(event.headers);
    const productId = event.pathParameters.productId
    
    try {
        if(user?.email) {
            await deleteCartItem(user.email, productId);

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

async function deleteCartItem(user, productId){
    const key = {PK: user, SK: `cart#${productId}`};
    await dbService.deleteItem(key);
}
module.exports.deleteCartItem = deleteCartItem;   