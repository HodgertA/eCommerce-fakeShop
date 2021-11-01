const { authenticateToken } = require('../utils/authenticateToken');

const { getCartItems } = require('../getCartItems/index');
const { deleteCartItem } = require('../deleteCartItem/index');

module.exports.handler = async (event, context, callback) => {
    const user = authenticateToken(event.headers);
    
    try {
        if(user?.email) {
            await clearCartItems(user.email);

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
        });
    
    } 
    catch (e) {
        console.log(e);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify("Request failed"),
        });
    }
};

async function clearCartItems(user){
    const itemsToDelete = await getCartItems(user);
    for(item of itemsToDelete){
        await deleteCartItem(user, item.productId);
    }
}
