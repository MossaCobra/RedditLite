// netlify/functions/fetchComments.js

exports.handler = async (event) => {
  console.log('fetchComments function called with params:', event.queryStringParameters);
  
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
    console.log('No postId provided');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([]),
    };
  }
  
  const url = `https://www.reddit.com/comments/${postId}.json?raw_json=1`;
  console.log('Fetching comments from:', url);
  
  try {
    // Add User-Agent header for Reddit API
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RedditLite/1.0.0',
      }
    });
    
    console.log('Reddit API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Reddit API error: ${response.status}`, errorText);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }
    
    const text = await response.text();
    console.log('Response text length:', text.length);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing Reddit response:', parseError);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }
    
    // Reddit returns an array where [0] is the post and [1] contains comments
    const comments = data[1]?.data?.children || [];
    console.log(`Successfully fetched ${comments.length} comments`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(comments),
    };
  } catch (error) {
    console.error('Unexpected error in fetchComments:', error.message, error.stack);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([]),
    };
  }
};