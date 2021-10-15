export const buildResponse = (statusCode: number, body?: any) => {
  console.log('build response');
  console.log(process.env.NODE_ENV);
  
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "http://localhost:3001",
      // 'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? "http://localhost:3001" : "http://todo-client-bucket.s3-website.eu-north-1.amazonaws.com/",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(body)
  }
}
