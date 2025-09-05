import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { selectFilter } from '../filters/filterSlice';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts', 
  async (search, { getState, rejectWithValue }) => {
    const state = getState();
    const subreddit = selectFilter(state);

    try {
      let url;
      if (search && search.trim() !== '') {
        url = `/.netlify/functions/reddit-proxy?path=search&search=${encodeURIComponent(search)}`;
      } else if (subreddit && subreddit !== '' && subreddit !== 'all') {
        url = `/.netlify/functions/reddit-proxy?path=${encodeURIComponent(subreddit)}`;
      } else {
        url = `/.netlify/functions/reddit-proxy?path=popular`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.data || !data.data.children) {
        throw new Error('Invalid Reddit API response structure');
      }

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
          selftext: postData.selftext,  
        };
      });

      return posts;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return rejectWithValue(error.message);
    }
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
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectPosts = state => state.posts.posts;
export const selectPostsStatus = state => state.posts.status;
export const selectPostsError = state => state.posts.error;

export default postsSlice.reducer;