export const buildResponse = (statusCode: number, body?: any) => {
  console.log('build response');
  console.log(process.env.NODE_ENV);
  
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? "http://localhost:3001" : "https://www.letsdo-list.com",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin"
    },
    body: JSON.stringify(body)
  }
}
