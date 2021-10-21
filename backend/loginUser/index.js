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
      if (event.body) {
        const userCredentials = JSON.parse(event.body);

        const emailKey = {email: userCredentials.email};
        const existingEmail = await dbService.getItem(emailKey);
        
        if(!isEmptyObject(existingEmail)){
          const hashedPassword = existingEmail.Item.password;
  
          if (await bcrypt.compare(userCredentials.password, hashedPassword)) {
              const accessToken = jwt.sign({email: userCredentials.email}, ACCESS_TOKEN_SECRET);
              
              body = JSON.stringify({accessToken: accessToken});
          }
          else{
              body = JSON.stringify({loginFailed: "Incorrect password."});
          }
        }
        else{
          body = JSON.stringify({loginFailed: "User does not exist."});
        }
      }
      callback(null, {
          statusCode: 200,
          body: body,
      });
  
  } catch (e) {
      console.log(e);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify("Request failed"),
      })
    }
  };