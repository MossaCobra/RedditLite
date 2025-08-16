import { useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import HeaderBack from '../components/Header/Back';
import Comments from '../components/Article/Comments';
import { fetchComments, selectComments, selectCommentsStatus, selectCommentsError } from '../features/comments/commentsSlice';

export default function PostDetail() {
  const dispatch = useDispatch();
  const location = useLocation();
  const post = location.state?.post;
  const comments = useSelector(selectComments);
  const status = useSelector(selectCommentsStatus);
  const error = useSelector(selectCommentsError);

  useEffect(() => {
    if (status === 'idle'){
      dispatch(fetchComments(post.id))
    }
  }, [status, dispatch]) 
  
  if (status === 'loading') return <div>Loading comments...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;


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
        selftext={post.selftext ? post.selftext : "No description provided"}
      />

      {comments?.map((comment) => (
        <Comments key={comment.data.id} comment={comment.data} />
      ))}
    </div>
  );
}
