
import { buildResponse } from '../../utilities';
import { STOCKHOLM_REGION} from '../../aws_constants';
const AWS = require('aws-sdk');
AWS.config.update({ region: STOCKHOLM_REGION });

const TableName = process.env.TABLE_NAME as string;
const dynamodb = new AWS.DynamoDB.DocumentClient();
export const createList = async (requestBody: any) => {
  const params = {
    TableName,
    Item: requestBody
  }

  console.log('creating list');
  
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
    return buildResponse(200, body);
  }, (error: any) => {
    console.error(error);
  })
}