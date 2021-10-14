
import * as AWS from 'aws-sdk';
import { buildResponse, scanDynamoRecords } from '../../utilities';
import { STOCKHOLM_REGION} from '../../aws_constants';
AWS.config.update({ region: STOCKHOLM_REGION });

const TableName = process.env.TABLE_NAME as string;
export const getLists = async () => {
  console.log('fetching list');
  console.log('TableName', TableName);
  const params = { TableName }
  const allCollections = await scanDynamoRecords(params, []);
  console.log('allCollections', allCollections);

  const body = allCollections
  console.log(buildResponse(200, body));
  console.log('end');
  
  
  return buildResponse(200, body);
}
