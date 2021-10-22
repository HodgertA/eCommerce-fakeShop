const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DynamoDB = require('aws-sdk/clients/dynamodb');
const DbUtils = require('../databaseManager');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const tableName = process.env.USERPOOL_TABLE_NAME;
const DB = new DynamoDB.DocumentClient();
const dbService = new DbUtils(DB, tableName);

const { isEmptyObject } = require('common/utils/objectUtils');

module.exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var body = "";
    
    try {
      const userCredentials = JSON.parse(event.body);

      const emailKey = {email: userCredentials.email};
      const existingEmail = await dbService.getItem(emailKey);
      
      if(isEmptyObject(existingEmail)){
        const hashedPassword = await bcrypt.hash(userCredentials.password, 10);
        const user = {email: userCredentials.email, password: hashedPassword};
        
        await dbService.putItem(user);

        const accessToken = jwt.sign({email: userCredentials.email}, ACCESS_TOKEN_SECRET);
        body = JSON.stringify({accessToken: accessToken});
      }

      else {
        body = JSON.stringify({emailExists: true});
      }
      
      callback(null, {
        statusCode: 200,
        body: body,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
      }
      })

    } catch (e) {
      console.log(e);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify("Could not create user."),
      })
    }
  };

