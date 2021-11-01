const DynamoDB = require('aws-sdk/clients/dynamodb');
const DbUtils = require('../databaseManager');
const tableName = process.env.ECOMMERCE_TABLE_NAME;
const DB = new DynamoDB.DocumentClient();
const dbService = new DbUtils(DB, tableName);
const ProcessMessages = require('./processMessages');

const EmailDB = require('../utils/emailDB');
const emailDB = new EmailDB(dbService);
const messageProcess = new ProcessMessages(emailDB)

module.exports.handler = async event => {

  try {
    const messages = getEventMessages(event.Records);
    await messageProcess.process(messages);
  }
  catch(e) {
    console.log(e);
  }

};

function getEventMessages(records){
  messages = [];
  
  records.forEach(record => {
    const body = JSON.parse(record.body);
    messages.push(JSON.parse(body.Message));
  });

  return messages;
}
