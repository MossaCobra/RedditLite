import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './features/posts/postsSlice'
//import filtersReducer from './features/filters/filterSlice'
import commentsReducer from './features/comments/commentsSlice'

const store = configureStore({
  reducer: {
    posts: postsReducer,
    //filters: filtersReducer,
    comments: commentsReducer,
  },
})

export default store;
