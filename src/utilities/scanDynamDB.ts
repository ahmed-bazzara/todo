import * as AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();
export const scanDynamoRecords = async(scanParams: any, itemArray: any): Promise<any> => {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    console.error(error);
  }
}