// netlify/functions/fetchPosts.js

exports.handler = async (event) => {
  console.log('fetchPosts function called with params:', event.queryStringParameters);
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const { search = '', subreddit = '' } = event.queryStringParameters || {};
  
  let url;
  if (search.trim() !== '') {
    url = `https://www.reddit.com/search.json?q=${encodeURIComponent(search)}`;
  } else if (subreddit && subreddit !== 'all') {
    url = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}`;
  } else {
    url = 'https://www.reddit.com/r/popular.json';
  }
  
  console.log('Fetching from Reddit URL:', url);
  
  try {
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
        body: JSON.stringify({
          error: `Reddit API returned ${response.status}`,
          posts: []
        }),
      };
    }
    
    const responseText = await response.text();
    console.log('Response text length:', responseText.length);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Reddit response:', parseError);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          error: 'Failed to parse Reddit response',
          posts: []
        }),
      };
    }
    
    if (!data || !data.data || !data.data.children) {
      console.error('Invalid Reddit response structure:', data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          error: 'Invalid Reddit response structure',
          posts: []
        }),
      };
    }
    
    const posts = data.data.children.map(child => {
      const p = child.data;
      return {
        id: p.id,
        title: p.title,
        author: p.author,
        subreddit: p.subreddit,
        imageUrl: p.preview?.images?.[0]?.source?.url || 
                 (p.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? p.url : null),
        num_comments: p.num_comments,
        score: p.score,
        created_utc: p.created_utc,
        permalink: p.permalink,
        selftext: p.selftext,
      };
    });
    
    console.log(`Successfully fetched ${posts.length} posts`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(posts),
    };
  } catch (error) {
    console.error('Unexpected error in fetchPosts:', error.message, error.stack);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        error: error.message,
        posts: []
      }),
    };
  }
};