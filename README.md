# eCommerce-fakeShop
## Introduction
www.ecommerce-fakeshop.ca

This is an eCommerce store web-application, with the frontend built in Javascript and React, and the backend built with NodeJS hosted using AWS.

This app includes the features of a webshop but also includes *user authentication*, *email confirmation*, and *payments*

#### **Implemented User Stories**
As a shopper, I would like to:
- view items for sale.
- add an item to my shopping bag.
- view my shopping bag.
- update the quantity of an item in my shopping bag.
- remove an item from my shopping bag.
- clear all items from my shopping bag.
- have the items in my bag saved for next time.
- place an order.
- receive an email confirmation of my order placement.
- view my previous purchases.
<br><br><br><br>

# Backend
The backend of the application is where the business logic is implemented. The code is hosted on AWS Lambda functions, and each function is fronted by an API Gateway rest API. Each Lambda function handles requests for one endpoint.
The application saves all items in two DynamoDB tables. The user-table is exclusively for user authentication and the e-Commerce table stores all other items, such as orders, products and cart items.
<br><br><br>

## Architecture Diagram
<img width="666" alt="Screen Shot 2021-11-02 at 8 34 44 PM" src="https://user-images.githubusercontent.com/71614738/139998050-eb7eb68f-e401-4a5a-9e30-609ac41e274f.png">
<br><br><br>

## API Design
The API for the this application is as follows:
```
POST /users
POST /login
GET /products
GET /cartItems
DELETE /cartItems
PUT /cartItems/{productId}
DELETE /cartItems/{productId}
POST /orders
GET /orders
GET /orders/{orderId}
POST /orders/{orderId}
```
<br>


| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 401 | `Unauthorized` |
| 500 | `INTERNAL SERVER ERROR` |
<br>

*Below are sample requests and responsesss for each endpoint, ($ specifies an optional parameter)*
<br>

### GET /products
Request
```
''
```
Response
```
[
  {
    "image": "{imageURL}",
    "SK": "product#123",
    "PK": "product",
    "description": "Tasty berries!",
    "inStock": 50,
    "price": 2,
    "name": "Saskatoon Berries",
    "productId": "123"
  }
]
```
<br>

### GET /cartItems
Request
```
Authorization: "Bearer {accessToken}"
```
Response
```
[
  {
    "image": "{imageURL}",
    "SK": "cart#100",
    "PK": "test@ecommerce-fakeshop.ca",
    "price": 2,
    "name": "Saskatoon Berries",
    "productId": "100"
  }
]
```
<br>

### DELETE /cartItems
Request
```
Authorization: "Bearer {accessToken}"
```
Response
```
''
```
<br>

### PUT /cartItems/123
Request
```
Authorization: "Bearer {accessToken}"

{
    "price": 10,
    "name": "apple pie",
    "productId": "130",
    "quantity": 1,
    "image": "{imageURL}"
}
```
Response
```
''
```
<br>

### DELETE /cartItems/123
Request
```
Authorization: "Bearer {accessToken}"
```
Response
```
''
```
<br>

### POST /orders
Request
```
$Authorization: "Bearer {accessToken}" (optional)

{
  "paymentMethodId": "{payment_method_id}",
  "cartItems": [
    {
      "price": 2,
      "name": "Saskatoon Berries",
      "productId": "100",
      "quantity": 4
    }
  ],
  "shippingData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "test@ecommerce-fakeshop.ca",
    "address1": "123 Main St",
    "city": "Winnipeg",
    "zip": "1B1 2A2",
    "province": "Manitoba",
    "country": "Canada"
  },
  "amount": 400
}

```
Response
```
------ if success -------
''

--------- else ----------
{
    error: "{errorMessage}
}
```
<br>

### GET /orders
Request
```
Authorization: "Bearer {accessToken}"
```
Response
```
[
  {
    "orderId": "111",
    "status": "paid",
    "createdAt": 1635737407,
    "amount": 1500
  }
]
```
<br>

### GET /orders/111
Request
```
Authorization: "Bearer {accessToken}"
```
Response
```
[
  {
    "quantity": 1,
    "orderId": "111",
    "name": "Honey Dill Sauce",
    "productId": "123"
  },
  {
    "quantity": 1,
    "orderId": 111,
    "name": "Apples",
    "productId": "321"
  }
]
```
<br>

### POST /users
Request
```
{
    "email": "test@ecommerce-fakeshop.ca",
    "password": "password1!"
}
```
Response
```
------ if success -------
{
    accessToken: "{accessToken}"
}

--------- else ----------
{
  "emailExists": true
}
```
<br>

### POST /login
Request
```
{
    "email": "test@ecommerce-fakeshop.ca",
    "password": "password1!"
}
```
Response
```
------ if success -------
{
    accessToken: "{accessToken}"
}

--------- else ----------
{
  "loginFailed": "{message}"
}

```

<br><br><br>

## DynamoDB Design
<br>

### Tables

*eCommerceTable*
| Entity | PK | SK |
| :---- | :---- | :---- |
| Product | `product` |  `product#`productId |
| CartItem | email | `cart#`productId |
| Order | email | `order#`productId |
| OrderItem | `orderItem#`orderId  | `orderItem#`productId |
| BlackListedEmail | email | email |

*userTable*
| Entity | PK | SK |
| :---- | :---- | :---- |
| user | email |  hashedPassword |
<br>

### Access patterns
| Access patterns | Query Condition|
| :---- | :---- |
| Get all products for sale. | PK = `product`, SK begins_with( `product` ) |
| Get/remove all the items in a customer's cart. | PK = email, SK begins_with( `cart` )|
| Get the past orders of a customer.| `order#`productId |
| Get all the items for a given order. | PK = `orderItem#`orderID, SK begins_with( `orderItem` ) |
<br><br><br>

## Deployment

### Environment Variables
Create a file named config.yml with the following variables
```
ACCESS_TOKEN_SECRET: 'x'
STRIPE_SECRET_KEY: 'y'
```

To get a stripe secret key you will need to create an account.
<br><br>

### Serverless Deployment
From the backend folder:
```
npm install
sls deploy
```
<br>

### AWS Simple Email Service
Creating a SES resources for sending emails through CloudFormation is not supported in Canada, so some manual configuration using the aws-cli and the console must be done.

1. **Create a configuration set in the Amazon SES console with the same name  as the '*CONFIGURATION_SET_NAME*' variable defined in the serverless.yaml file**

2. Attach the SNS topic created during deployment to the configuration set
    - Select `bounce` and `complaint` as the event types
3. To create the email template:
    ```
    aws ses update-template --cli-input-json file://sendEmailConfirmation/emailTemplate/emailTemplate.json
    ```
<br><br><br>

# Frontend
The products, cart and checkout pages were inspired by this tutorial video https://www.youtube.com/watch?v=377AQ0y6LPA&ab_channel=JavaScriptMastery
<br><br>

## Running the Application
To run the application locally, from the frontend-react folder:
```
npm install
npm start
```
<br><br>

# License
[MIT](https://choosealicense.com/licenses/mit/)