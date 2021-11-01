const DynamoDB = require('aws-sdk/clients/dynamodb');
const SES = require('aws-sdk/clients/ses');
const DbUtils = require('../databaseManager');

const ses = new SES({ apiVersion: '2010-12-01' });
const tableName = process.env.ECOMMERCE_TABLE_NAME;
const DB = new DynamoDB.DocumentClient();
const dbService = new DbUtils(DB, tableName);

const EmailDB = require('../utils/emailDB');
const emailDB = new EmailDB(dbService);

const EmailService = require('../utils/emailService');
const source = "no-reply@ecommerce-fakeshop.ca";
const sesTemplateName = process.env.CONFIRMATION_TEMPLATE_NAME;
const configurationSetName = process.env.CONFIGURATION_SET_NAME;
const emailService = new EmailService(ses, sesTemplateName, source, configurationSetName);

const SendEmailConfirmation = require('./sendEmailConfirmation');
const sendEmailConfirmation = new SendEmailConfirmation(emailDB, emailService)

module.exports.handler = async event => {
    const orderConfirmations = getOrderConfirmations(event.Records);
    await sendEmailConfirmation.process(orderConfirmations);
  };
  
  function getOrderConfirmations(records){
    orderConfirmations = [];
    
    records.forEach(record => {
        orderConfirmations.push(JSON.parse(record.body));
    });
  
    return orderConfirmations;
  }
  