import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: 'filter',
    initialState: {filter: 'all'},
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        clearFilter: (state) => {
            state.filter = '';
        }
    }
})

export const { setFilter, clearFilter } = filterSlice.actions;

export const selectFilter = (state) => state.filters.filter;

export default filterSlice.reducer; 