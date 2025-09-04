// netlify/functions/fetchComments.js
export async function handler(event) {
  const { postId } = event.queryStringParameters || {};

  if (!postId) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify([]),
    };
  }

  try {
    const response = await fetch(`https://www.reddit.com/comments/${postId}.json`);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = [{ data: { children: [] } }, { data: { children: [] } }];
    }

    const comments = data[1]?.data?.children || [];

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(comments),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify([]),
    };
  }
}
