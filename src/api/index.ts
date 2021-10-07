

import * as AWS from 'aws-sdk';
import { buildResponse } from '../utilities';
import { STOCKHOLM_REGION , dynamodbTableName} from '../aws_constants';
AWS.config.update({ region: STOCKHOLM_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const scanDynamoRecords = async(scanParams: any, itemArray: any): Promise<any> => {
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

export const getCollections = async () => {
  const params = {
    TableName: dynamodbTableName
  }
  const allCollections = await scanDynamoRecords(params, []);
  const body = {
    collections: allCollections
  }
  return buildResponse(200, body);
}

export const getCollection = async (id: number) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': id
    }
  }
  return await dynamodb.get(params).promise().then((response) => {
    return buildResponse(200, response.Item);
  }, (error) => {
    console.error(error);
  });
}

export const saveCollection = async (requestBody: any) => {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }

  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error(error);
  })
}

export const modifyCollection = async (id: number, updateKey: string, updateValue: any) => {
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: dynamodbTableName,
    Key: {
      'id': id
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  }

  return await dynamodb.update(params).promise().then((response) => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error(error);
  })
}

export const deleteCollection = async (id: number) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': id
    },
    ReturnValues: 'ALL_OLD'
  }
  return await dynamodb.delete(params).promise().then((response) => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}