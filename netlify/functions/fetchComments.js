export async function handler(event) {
  const { postId } = event.queryStringParameters || {};

  if (!postId) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing postId' }),
    };
  }

  try {
    const response = await fetch(`https://www.reddit.com/comments/${postId}.json`);
    const text = await response.text();

    console.log('Reddit comments raw response:', text.slice(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn('Reddit returned non-JSON for comments, using empty array');
      data = [{ data: { children: [] } }, { data: { children: [] } }];
    }

    const comments = data[1]?.data?.children || [];

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(comments),
    };
  } catch (err) {
    console.error('FetchComments error:', err);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify([]),
    };
  }
}
