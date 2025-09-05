export const handler = async (event, context) => {
  // Handle CORS preflight
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

    // Build Reddit URL
    let redditUrl;
    if (path === 'search' && search) {
      redditUrl = `https://oauth.reddit.com/search.json?q=${encodeURIComponent(search)}&limit=25`;
    } else if (path.startsWith('comments/')) {
      redditUrl = `https://oauth.reddit.com/${path}.json`;
    } else {
      redditUrl = `https://oauth.reddit.com/r/${path}.json?limit=25`;
    }

    // Read credentials from environment variables
    const clientId = process.env.REDDIT_CLIENT_ID;
    const clientSecret = process.env.REDDIT_CLIENT_SECRET;
    const username = process.env.REDDIT_USERNAME;
    const password = process.env.REDDIT_PASSWORD;

    if (!clientId || !clientSecret || !username || !password) {
      throw new Error('Missing Reddit OAuth credentials in environment variables.');
    }

    // Get access token
    const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: username,
        password: password,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new Error('Failed to get Reddit access token.');
    }

    const accessToken = tokenData.access_token;

    // Fetch Reddit data using OAuth token
    const redditRes = await fetch(redditUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': `web:redditlite:v1.0 (by /u/${username})`,
      },
    });

    if (!redditRes.ok) {
      throw new Error(`Reddit API error: ${redditRes.status} ${redditRes.statusText}`);
    }

    const data = await redditRes.json();

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
    console.error('Reddit OAuth proxy error:', error.message);
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
