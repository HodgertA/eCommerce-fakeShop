class DbUtils {
    constructor(db, tableName) {
      this.DB = db;
      this.tableName = tableName;
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
    };

    queryItem(
      condition,
      names,
      values,
      consistentRead = false,
    ) {
      var params = {
        TableName: this.tableName,
        KeyConditionExpression: condition,
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