
import { buildResponse } from '../../utilities';
import { STOCKHOLM_REGION} from '../../aws_constants';
import * as AWS from 'aws-sdk';
AWS.config.update({ region: STOCKHOLM_REGION });

const TableName = process.env.TABLE_NAME as string;
const dynamodb = new AWS.DynamoDB.DocumentClient();
export const createList = async (requestBody: any, test: any, testTwo: any) => {
  const body = requestBody.body;
  console.log(requestBody.id);
  
  const params = {
    TableName,
    Item: requestBody
  }
  // console.log(params.TableName);
  // console.log(params.Item);
  
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
    console.log('here');
    
    return buildResponse(200, body);
  }, (error) => {
    console.error(error);
    return buildResponse(204, {});
  })
}