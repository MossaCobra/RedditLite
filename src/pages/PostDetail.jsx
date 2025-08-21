import { useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import HeaderBack from '../components/Header/Back';
import Comments from '../components/Article/Comments';
import {
  fetchComments,
  selectComments,
  selectCommentsStatus,
  selectCommentsError,
  resetComments,
} from '../features/comments/commentsSlice';

export default function PostDetail() {
  const dispatch = useDispatch();
  const location = useLocation();
  const post = location.state?.post;
  const comments = useSelector(selectComments);
  const status = useSelector(selectCommentsStatus);
  const error = useSelector(selectCommentsError);

  useEffect(() => {
    if (!post) return;

    dispatch(resetComments());
    dispatch(fetchComments(post.id));
  }, [dispatch, post?.id]);

  if (!post) return <Navigate to="/" />;

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
        selftext={post.selftext || "No description provided"}
      />

      {status === 'loading' && <div>Loading comments...</div>}
      {status === 'failed' && <div>Error: {error}</div>}
      {status === 'succeeded' && comments?.map((comment) => (
        <Comments key={comment.data.id} comment={comment.data} />
      ))}
    </div>
  );
}
