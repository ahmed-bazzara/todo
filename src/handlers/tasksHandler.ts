import * as AWS from 'aws-sdk';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyCallback,
} from 'aws-lambda';
// import { buildResponse, scanDynamoRecords } from '../utilities';
import { STOCKHOLM_REGION } from '../aws_constants';
AWS.config.update({ region: STOCKHOLM_REGION });
const dynamo = new AWS.DynamoDB.DocumentClient();
// const TableName = process.env.TABLE_NAME as string;
export const handler = async (
  event: APIGatewayProxyEvent,
  context: any,
  callback: APIGatewayProxyCallback
): Promise<APIGatewayProxyResult> => {
  // const params = { TableName };
  // const allCollections = await scanDynamoRecords(params, []);

  // const body = allCollections;

  // return buildResponse(200, body);
  console.log({ event });
  console.log({ context });
  console.log(process.env.NODE_ENV);

  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'https://letsdo-list.com',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Origin, x-api-key, X-Amz-Security-Token',
  };

  try {
    switch (event.httpMethod) {
      case 'DELETE':
        if (event.body) {
          body = await dynamo.delete(JSON.parse(event.body)).promise();
        }
        break;
      case 'GET':
        if (event.queryStringParameters?.TableName) {
          body = await dynamo
            .scan({ TableName: event.queryStringParameters.TableName })
            .promise();
        }
        break;
      case 'POST':
        if (event.body) {
          body = await dynamo.put(JSON.parse(event.body)).promise();
        }
        break;
      case 'PUT':
        if (event.body) {
          body = await dynamo.update(JSON.parse(event.body)).promise();
        }
        break;
      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
  } catch (err: any) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
