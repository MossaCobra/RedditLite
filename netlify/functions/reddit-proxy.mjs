export const handler = async (event, context) => {
  console.log('Reddit proxy called:', event.queryStringParameters);

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

    console.log('Fetching:', redditUrl);

    const response = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Reddit blocked the request. This might be due to rate limiting or blocked User-Agent.');
      }
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minute cache
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