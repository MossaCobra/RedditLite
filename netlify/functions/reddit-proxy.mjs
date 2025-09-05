// netlify/functions/reddit.mjs
export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const path = params.path || 'popular';
    const search = params.search;

    let redditUrl;
    if (path === 'search' && search) {
      redditUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(search)}&limit=25`;
    } else if (path.startsWith('comments/')) {
      redditUrl = `https://www.reddit.com/${path}.json`;
    } else {
      redditUrl = `https://www.reddit.com/r/${path}.json?limit=25`;
    }

    // Minimal headers — replace YOUR_REDDIT_USERNAME with your real Reddit username
    const response = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'web:redditlite:v1.0 (by /u/No-Pollution6590)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', 
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Reddit proxy error:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch Reddit data',
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
