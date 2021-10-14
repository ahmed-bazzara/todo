
import * as AWS from 'aws-sdk';
import { buildResponse } from '../../utilities';
import { STOCKHOLM_REGION} from '../../aws_constants';
AWS.config.update({ region: STOCKHOLM_REGION });

const TableName = process.env.TABLE_NAME as string;
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const removeList = async (event: any, context: any) => {
  
  const data = JSON.parse(event.body);
  console.log('removing list');
  const id = event.pathParameters.id;
  console.log(typeof id);
  
  const params = {
    TableName,
    Key: {
      'id': parseInt(id)
    },
    ReturnValues: 'ALL_OLD'
  }
  
  return await dynamodb.delete(params).promise().then((response) => {
    const body = response.Attributes

    // const body = {
    //   Operation: 'DELETE',
    //   Message: 'SUCCESS',
    //   Item: response
    // }
      console.log('buildResponse');
      return buildResponse(200, body);
    }, (error) => {
      console.error('error:', error);
      
      return buildResponse(500);
    })
}
