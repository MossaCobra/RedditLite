// netlify/functions/fetchPosts.js
export async function handler(event) {
  const { search = '', subreddit = '' } = event.queryStringParameters || {};

  let url;
  if (search.trim() !== '') {
    url = `https://www.reddit.com/search.json?q=${encodeURIComponent(search)}`;
  } else if (subreddit.trim() !== '' && subreddit.toLowerCase() !== 'all') {
    url = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}.json`;
  } else {
    url = 'https://www.reddit.com/r/popular.json';
  }

  try {
    const response = await fetch(url);
    const text = await response.text();

    // parse safely
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { data: { children: [] } };
    }

    const posts = (data?.data?.children || []).map(child => {
      const postData = child.data;
      let imageUrl = null;
      if (postData.preview?.images?.length) {
        imageUrl = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
      } else if (postData.url?.match(/\.(jpg|png|gif)$/)) {
        imageUrl = postData.url;
      }

      return {
        id: postData.id,
        title: postData.title,
        author: postData.author,
        subreddit: postData.subreddit,
        imageUrl,
        num_comments: postData.num_comments,
        score: postData.score,
        created_utc: postData.created_utc,
        permalink: postData.permalink,
        selftext: postData.selftext,
      };
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(posts), // always string
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify([]), // fallback array
    };
  }
}
