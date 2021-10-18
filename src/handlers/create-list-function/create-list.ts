
import * as AWS from 'aws-sdk';
// import { DraggableContainer, DragabbleEntityType } from 'simple-ui-library';
import { buildResponse } from 'utilities';
import { STOCKHOLM_REGION } from 'aws_constants';
AWS.config.update({ region: STOCKHOLM_REGION });

const TableName = process.env.TABLE_NAME as string;
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const createList = async (event: any) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName,
    Item: data
  }
  
  return await dynamodb.put(params).promise().then(() => {
    const body = data
    // const body = {
    //   Operation: 'SAVE',
    //   Message: 'SUCCESS',
    //   Item: data
    // }
    console.log('here');
    
    return buildResponse(200, body);
  }, (error) => {
    console.error(error);
    return buildResponse(204, {});
  })
}