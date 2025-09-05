// src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ search = '', subreddit = '' } = {}, thunkAPI) => {
    const state = thunkAPI.getState();
    const effectiveSearch = search || state.filters.search || '';
    const effectiveSubreddit = subreddit || state.filters.subreddit || '';
    const params = new URLSearchParams({ search: effectiveSearch, subreddit: effectiveSubreddit });
    
    const response = await fetch(`/.netlify/functions/fetchPosts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.error) {
      console.error('Function returned error:', data.error);
      return data.posts || [];
    }
    
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  }
);

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