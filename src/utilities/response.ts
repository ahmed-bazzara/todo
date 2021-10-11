export const buildResponse = (statusCode: number, body?: any) => {
  console.log('build response');
  
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify(body)
  }
}
