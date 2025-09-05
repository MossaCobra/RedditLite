import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://www.reddit.com/comments/${postId}.json`, {
        headers: {
          'User-Agent': 'RedditLiteApp/1.0 by YourUsername',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data) || data.length < 2) {
        throw new Error('Invalid Reddit API response structure');
      }

      return data[1].data.children;
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      return rejectWithValue(error.message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    resetComments: (state) => {
      state.comments = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetComments } = commentsSlice.actions;

export const selectComments = (state) => state.comments.comments;
export const selectCommentsStatus = (state) => state.comments.status;
export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;