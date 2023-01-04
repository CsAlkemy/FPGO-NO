import { createSlice } from '@reduxjs/toolkit';

const overviewMainTableDataSlice = createSlice({
  name: 'overviewMainTableData',
  initialState: {
    tableData : []
  },
  reducers: {
    setOverviewMainTableDataSlice: (state, {payload}) => {
      state.tableData = payload;
    },
  }
});

export const { setOverviewMainTableDataSlice } = overviewMainTableDataSlice.actions;
export const selectOverviewMainTableData = ({ overviewMainTableData }) => overviewMainTableData.tableData;

export default overviewMainTableDataSlice.reducer;
