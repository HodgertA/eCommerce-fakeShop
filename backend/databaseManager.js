class DbUtils {
    constructor(db, tableName) {
      this.DB = db;
      this.tableName = tableName;
    }

    deleteItem(key) {
      const params = {
        TableName: this.tableName,
        Key: key,
      };
      return new Promise((resolve, reject) => {
        this.DB.delete(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  
    putItem(itemObject) {
      const params = {
        Item: itemObject,
        TableName: this.tableName,
      };
      return new Promise((resolve, reject) => {
        this.DB.put(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
   
    getItem(key) {
        const params = {
          Key: key,
          TableName: this.tableName
        };
        return new Promise((resolve, reject) => {
          this.DB.get(params, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
    }

    updateItem(expression, key, names, values, condition = undefined) {
      const params = {
        TableName: this.tableName,
        Key: key,
        UpdateExpression: expression,
        ConditionExpression: condition,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      };
      return new Promise((resolve, reject) => {
        this.DB.update(params, function (err) {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    }

    queryItem(expression, names, values, consistentRead = false) {
      var params = {
        TableName: this.tableName,
        KeyConditionExpression: expression,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConsistentRead: consistentRead,
      };
      return new Promise((resolve, reject) => {
        this.DB.query(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
}
module.exports = DbUtils;