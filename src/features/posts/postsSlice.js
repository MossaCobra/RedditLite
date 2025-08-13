import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (search) => {
  const url = search 
    ? `https://www.reddit.com/search.json?q=${encodeURIComponent(search)}` 
    : 'https://www.reddit.com/r/popular.json';
    
  const response = await fetch(url);
  const data = await response.json();

  const posts = data.data.children.map(child => {
    const postData = child.data;
    let imageUrl = null;

    if (postData.preview && postData.preview.images && postData.preview.images.length > 0) {
      imageUrl = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
    } else if (postData.url && (postData.url.endsWith('.jpg') || postData.url.endsWith('.png') || postData.url.endsWith('.gif'))) {
      imageUrl = postData.url;
    }

    return {
      id: postData.id,
      title: postData.title,
      author: postData.author,
      subreddit: postData.subreddit,
      imageUrl,
      num_comments: postData.num_comments,
      score: postData.score,
      created_utc: postData.created_utc,
      permalink: postData.permalink,
    };
  });

  return posts;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectPosts = state => state.posts.posts;
export const selectPostsStatus = state => state.posts.status;
export const selectPostsError = state => state.posts.error;

export default postsSlice.reducer;
