import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchComments = createAsyncThunk('comments/fetchComments', async (id) => {
    const res = await fetch (`https://www.reddit.com/comments/${id}.json`);
    const data = await res.json();
    return data[1].data.children;
})

const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchComments.pending, state => {
            state.status = 'loading';
            state.error = null;
        })

        builder.addCase(fetchComments.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.comments = action.payload;
        })

        builder.addCase(fetchComments.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export const selectComments = state => state.comments.comments;
export const selectCommentsStatus = state => state.comments.status;
export const selectCommentsError = state => state.comments.error;

export default commentsSlice.reducer;