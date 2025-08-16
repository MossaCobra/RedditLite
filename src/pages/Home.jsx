import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import Header from  '../components/Header';
import { fetchPosts, selectPosts, selectPostsStatus, selectPostsError } from '../features/posts/postsSlice';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector(selectPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);
  const [ search, setSearch ] = useState("");

  function handleKeyPress (event) {
    if (event.key === 'Enter')
      dispatch(fetchPosts(search))
  }

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div>Loading posts...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div>
      <Header search={search} setSearch={setSearch} handleKeyPress={handleKeyPress} />
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
          onCommentsClick={() => navigate(`/posts/${post.id}`, { state: { post } })}
        />
      ))}
    </div>
  );
}
