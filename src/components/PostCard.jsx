import { useState } from 'react';

function PostCard({ title, author, subreddit, imageUrl, num_comments, score, created_utc, permalink, selftext, onCommentsClick }) {
  const date = new Date(created_utc * 1000).toLocaleString();

  const [currentScore, setCurrentScore] = useState(score);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  const handleUpvote = () => {
    if (hasUpvoted) {
      setCurrentScore(currentScore - 1);
      setHasUpvoted(false);
    } else {
      let newScore = currentScore + 1;
      if (hasDownvoted) {
        newScore += 1;
        setHasDownvoted(false);
      }
      setCurrentScore(newScore);
      setHasUpvoted(true);
    }
  };

  const handleDownvote = () => {
    if (hasDownvoted) {
      setCurrentScore(currentScore + 1);
      setHasDownvoted(false);
    } else {
      let newScore = currentScore - 1;
      if (hasUpvoted) {
        newScore -= 1;
        setHasUpvoted(false);
      }
      setCurrentScore(newScore);
      setHasDownvoted(true);
    }
  };

  const message = "💬";

  return (
    <div
      className="border rounded p-3 mb-4 mx-auto"
      style={{ width: '70vw', maxWidth: '900px', backgroundColor: 'white', marginTop: '0.5rem'}}
    >
      <div className="mb-2">
        <h4>{title}</h4>
      </div>

      <div className="d-flex mb-3 align-items-center" style={{ minHeight: '250px' }}>
        <div className="d-flex flex-column align-items-center" style={{ width: '70px' }}>
          <button
            onClick={handleUpvote}
            aria-label="Upvote"
            className="btn btn-light"
            style={{ backgroundColor: 'white', border: 'none', padding: 0 }}
          >
            <i
              className={hasUpvoted ? 'bi bi-arrow-up-circle-fill' : 'bi bi-arrow-up-circle'}
              style={{ fontSize: '24px', color: hasUpvoted ? 'blue' : 'black' }}
            />
          </button>
          <span aria-label="Current Score">{currentScore}</span>
          <button
            onClick={handleDownvote}
            aria-label="Downvote"
            className="btn btn-light"
            style={{ backgroundColor: 'white', border: 'none', padding: 0 }}
          >
            <i
              className={hasDownvoted ? 'bi bi-arrow-down-circle-fill' : 'bi bi-arrow-down-circle'}
              style={{ fontSize: '24px', color: hasDownvoted ? 'red' : 'black' }}
            />
          </button>
        </div>

        <div className="flex-grow-1 text-center px-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="image"
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div
              style={{
                height: '300px',
                lineHeight: '300px',
                color: '#aaa',
                borderRadius: '8px',
                backgroundColor: '#f0f0f0',
              }}
            >
              No Image
            </div>
          )}
        </div>

        <div className="d-flex flex-column align-items-center" style={{ width: '70px' }}>
          <button
            onClick={onCommentsClick}
            style={{
              fontSize: '24px',
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Comments"
          >
            {message}
          </button>
          <span>{num_comments}</span>
        </div>
      </div>

      <div>
        {selftext && <p>{selftext}</p>}
      </div>

      <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '0.25rem', marginBottom: 0 }}>
        <p style={{ marginBottom: '0.1rem' }}>
          Posted by u/{author} in r/{subreddit}
        </p>
        <p style={{ marginBottom: 0 }}>{date}</p>
      </div>
    </div>
  );
}

export default PostCard;
