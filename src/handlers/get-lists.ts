
import * as AWS from 'aws-sdk';
import { buildResponse, scanDynamoRecords } from '../utilities';
import { STOCKHOLM_REGION} from '../aws_constants';
AWS.config.update({ region: STOCKHOLM_REGION });

const TableName = process.env.TABLE_NAME as string;
export const getLists = async () => {
  const params = { TableName }
  const allCollections = await scanDynamoRecords(params, []);
  const body = {
    collections: allCollections
  }
  return buildResponse(200, body);
}
