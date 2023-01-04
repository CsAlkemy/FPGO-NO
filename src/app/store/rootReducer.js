import { combineReducers } from '@reduxjs/toolkit';
import fuse from './fuse';
import i18n from './i18nSlice';
import user from './userSlice';
import creditcheck from './credit-check/creditCheck'
import overviewMainTableData from './overview-table/overviewTableSlice';
import overviewTableDataSearchText from './overview-table/overviewTableDataSearchTextSlice';
import { apiSlice } from 'app/store/api/apiSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    creditcheck,
    overviewMainTableData,
    overviewTableDataSearchText,
    [apiSlice.reducerPath] : apiSlice.reducer,
    ...asyncReducers,
  });

  /*
	Reset the redux store when user logged out
	 */
  if (action.type === 'user/userLoggedOut') {
    // state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
