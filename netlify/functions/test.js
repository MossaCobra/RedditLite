// Create this file: netlify/functions/test.js
// This is just to test if Netlify Functions are working

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Netlify Functions are working!',
      method: event.httpMethod,
      params: event.queryStringParameters,
      timestamp: new Date().toISOString()
    }),
  };
};