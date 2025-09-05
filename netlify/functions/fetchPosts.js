// netlify/functions/fetchPosts.js

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS 
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
    url = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}.json`;
  } else {
    url = 'https://www.reddit.com/r/popular.json';
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Reddit API error: ${response.status}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }
    
    const data = await response.json();
    
    const posts = data.data?.children?.map(child => {
      const p = child.data;
      return {
        id: p.id,
        title: p.title,
        author: p.author,
        subreddit: p.subreddit,
        imageUrl: p.preview?.images?.[0]?.source?.url.replace(/&amp;/g, '&') || 
                 (p.url?.match(/\.(jpg|png|gif)$/i) ? p.url : null),
        num_comments: p.num_comments,
        score: p.score,
        created_utc: p.created_utc,
        permalink: p.permalink,
        selftext: p.selftext,
      };
    }) || [];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(posts),
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([]),
    };
  }
};