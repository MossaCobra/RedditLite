import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import { fetchPosts, selectPosts, selectPostsStatus, selectPostsError } from '../features/posts/postsSlice';

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div>Loading posts...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div>
      {posts.map(post => (
        <PostCard
          key={post.id}
          title={post.title}
          author={post.author}
          subreddit={post.subreddit}
          imageUrl={post.imageUrl}
          num_comments={post.num_comments}
          score={post.score}
          created_utc={post.created_utc}
          permalink={post.permalink}
        />
      ))}
    </div>
  );
}
