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

  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'https://www.letsdo-list.com',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,PATCH,DELETE',
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
        if (
          event.queryStringParameters?.TableName &&
          event.queryStringParameters?.id
        ) {
          body = await dynamo
            .get({
              TableName: event.queryStringParameters.TableName,
              Key: { id: event.queryStringParameters.id },
            })
            .promise();
        } else if (event.queryStringParameters?.TableName) {
          body = await dynamo
            .scan({ TableName: event.queryStringParameters.TableName })
            .promise();
        }
        break;
      case 'PUT':
        if (event.body && event.queryStringParameters?.TableName) {
          const requestJSON = JSON.parse(event.body);
          body = await dynamo
            .put({
              TableName: event.queryStringParameters.TableName,
              Item: {
                id: requestJSON.id,
                tasks: requestJSON.tasks,
                groups: requestJSON.groups,
              },
            })
            .promise();
        }
        break;
      case 'PATCH':
        if (event.body && event.queryStringParameters?.TableName) {
          const requestJSON = JSON.parse(event.body);
          body = await dynamo
            .update({
              TableName: event.queryStringParameters.TableName,
              Key: { id: requestJSON.id },
              // UpdateExpression
              // Item: {
              //   id: requestJSON.id,
              //   tasks: requestJSON.tasks,
              //   groups: requestJSON.groups,
              // },
            })
            .promise();
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

  console.log({ statusCode });

  return {
    statusCode,
    body,
    headers,
  };
};
