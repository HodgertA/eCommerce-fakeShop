const DynamoDB = require('aws-sdk/clients/dynamodb');
const DbUtils = require('../databaseManager');

const tableName = process.env.ECOMMERCE_TABLE_NAME;
const DB = new DynamoDB.DocumentClient();
const dbService = new DbUtils(DB, tableName);

const { authenticateToken } = require('../utils/authenticateToken');

module.exports.handler = async (event, context, callback) => {
    const user = authenticateToken(event.headers);
    try {

        if(user?.email) {
            const response = await getCartItems(user.email);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(response),
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

async function getCartItems(user){
    const expression =  '#pk = :pk AND begins_with(#sk,:sk) ';
    const names = {
        '#pk': 'PK',
        '#sk': 'SK',
    };
        const values = {
        ':pk': user,
        ':sk': 'cart',
    };

    const response = await dbService.queryItem(expression, names, values);
    return response?.Items;
}
module.exports.getCartItems = getCartItems;   
