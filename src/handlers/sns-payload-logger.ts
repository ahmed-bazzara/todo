import * as AWS from 'aws-sdk';
import { buildResponse } from '../utilities';
import {
  getCollections,
  getCollection,
  saveCollection,
  modifyCollection,
  deleteCollection
} from '../api'

AWS.config.update({ region: 'eu-north-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const HEALTH_PATH = '/health';
const COLLECTION_PATH = '/collection';
const COLLECTIONS_PATH = '/collections';

export const snsPayloadLoggerHandler = async (event: any = {}, context: any): Promise<any> => {
  console.log('Request Event: ', event);
  console.log('Request context: ', context);
  console.info(event);
  const requestBody = event.body && JSON.parse(event.body);
  let response;
  switch(true) {
    case event.httpMethod === 'GET' && event.path === HEALTH_PATH:
      response = buildResponse(200);
      break;
    case event.httpMethod === 'GET' && event.path === COLLECTIONS_PATH:
      response = await getCollections();
      break;
    case event.httpMethod === 'GET' && event.path === COLLECTION_PATH:
      response = await getCollection(event.queryStringParameters.ticketId);
      break;
    case event.httpMethod === 'POST' && event.path === COLLECTION_PATH:
      response = await saveCollection(requestBody);
      break;
    case event.httpMethod === 'PATCH' && event.path === COLLECTION_PATH:
      response = await modifyCollection(requestBody.id, requestBody.key, requestBody.val);
      break;
    case event.httpMethod === 'DELETE' && event.path === COLLECTION_PATH:
      response = await deleteCollection(requestBody.id);
      break;
  }

  return response;
}