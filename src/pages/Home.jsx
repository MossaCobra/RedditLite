import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import {
  fetchPosts,
  selectPosts,
  selectPostsStatus,
  selectPostsError,
} from '../features/posts/postsSlice';
import { selectFilter, clearFilter } from '../features/filters/filterSlice';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector(selectPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);
  const subreddit = useSelector(selectFilter);

  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidePanel = () => {
    setIsOpen(!isOpen);
  };

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      dispatch(fetchPosts({ search }));
      dispatch(clearFilter());
      setSearch('');
      setIsSearching(true);
    }
  }

  useEffect(() => {
    if (!isSearching) {
      dispatch(fetchPosts({ subreddit }));
    }
  }, [subreddit, isSearching, dispatch]);

  if (status === 'loading') return <div>Loading posts...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header
        search={search}
        setSearch={setSearch}
        handleKeyPress={handleKeyPress}
        onToggleSidePanel={toggleSidePanel}
      />

      {isOpen && (
        <SidePanel
          onClose={() => setIsOpen(false)}
          setIsSearching={setIsSearching}
        />
      )}

      {status === 'succeeded' && posts.length === 0 ? (
        <p style={{ marginTop: '2rem' }}>No Results Found</p>
      ) : (
        posts.map((post) => (
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
            onCommentsClick={() =>
              navigate(`/posts/${post.id}`, { state: { post } })
            }
          />
        ))
      )}
    </div>
  );
}
