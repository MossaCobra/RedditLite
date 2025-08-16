function Comments({ comment }) {
  const { author, body, score, created_utc } = comment;
  const date = new Date(created_utc * 1000).toLocaleString();

  return (
    <section
      className="border rounded p-3 mb-3 mx-auto"
      style={{ width: '70vw', maxWidth: '900px', backgroundColor: '#f9f9f9' }}
    >
      <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.25rem' }}>
        <strong>u/{author}</strong> • {date} • {score} points
      </p>
      <p style={{ margin: 0 }}>{body}</p>
    </section>
  );
}

export default Comments;
