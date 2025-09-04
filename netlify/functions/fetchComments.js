export async function handler(event) {
  const query = event.queryStringParameters || {};
  const postId = query.postId;

  if (!postId) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing postId" }),
    };
  }

  const response = await fetch(`https://www.reddit.com/comments/${postId}.json`);
  const data = await response.json();

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data[1].data.children),
  };
}
