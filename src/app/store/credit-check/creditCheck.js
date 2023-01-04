import { createSlice } from '@reduxjs/toolkit';

const creditCheckSlice = createSlice({
    name: 'creditcheck',
    initialState: {
        state: false,
        creditCheckInfo: '',
    },
    reducers: {
        setCreditCheckTypeAndId: (state, {payload}) => {
            state.state = true;
            state.creditCheckInfo = payload;
        }

    }
});

export const { setCreditCheckTypeAndId } = creditCheckSlice.actions;

export default creditCheckSlice.reducer;
