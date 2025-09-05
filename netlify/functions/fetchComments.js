// netlify/functions/fetchComments.js

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const { postId } = event.queryStringParameters || {};
  
  if (!postId) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([]),
    };
  }
  
  try {
    const response = await fetch(`https://www.reddit.com/comments/${postId}.json`);
    
    if (!response.ok) {
      console.error(`Reddit API error: ${response.status}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }
    
    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing Reddit response:', parseError);
      data = [{ data: { children: [] } }, { data: { children: [] } }];
    }
    
    const comments = data[1]?.data?.children || [];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(comments),
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([]),
    };
  }
};