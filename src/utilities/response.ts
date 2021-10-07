export const buildResponse = (statusCode: number, body?: any) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify(body)
  }
}
