import { useLocation, Navigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import HeaderBack from '../components/Header/Back';

export default function PostDetail() {
  const location = useLocation();
  const post = location.state?.post;

  if (!post) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <HeaderBack />
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
    </div>
  );
}
