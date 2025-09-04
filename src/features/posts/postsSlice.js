import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { selectFilter } from '../filters/filterSlice';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ search = '', subreddit = '' } = {}, thunkAPI) => {
    const state = thunkAPI.getState();
    const effectiveSearch = search || state.filters.search || '';
    const effectiveSubreddit = subreddit || state.filters.subreddit || '';

    const params = new URLSearchParams({ search: effectiveSearch, subreddit: effectiveSubreddit });
    const response = await fetch(`/.netlify/functions/fetchPosts?${params.toString()}`);
    const posts = await response.json();
    return posts;
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
