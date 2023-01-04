import { createSlice } from '@reduxjs/toolkit';

const overviewTableDataSearchTextSlice = createSlice({
  name: 'overviewTableDataSearchText',
  initialState: {
    searchText: ''
  },
  reducers: {
    setSearchText: (state, {payload}) => {
      state.searchText = payload;
    }
    // setSearchText: {
    //   reducer: (state, action) => {
    //     state.searchText = action.payload;
    //   },
    //   prepare: (event) => ({ payload: event.target.value || '' }),
    // },
  }
});

// export const { setOverviewMainTableDataSlice } = overviewMainTableDataSlice.actions;

export const { setSearchText } = overviewTableDataSearchTextSlice.actions;
export const selectSearchText = ({ overviewTableDataSearchText }) => overviewTableDataSearchText.searchText;

export default overviewTableDataSearchTextSlice.reducer;
