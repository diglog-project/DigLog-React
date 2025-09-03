import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sseConnected: false,
    message: '',
    messageCount: 0,
};

const sseSlice = createSlice({
    name: 'sseSlice',
    initialState: initialState,
    reducers: {
        setSseConnected: (state, action) => {
            return {
                ...state,
                sseConnected: action.payload.sseConnected,
            };
        },
        setMessage: (state, action) => {
            return {
                ...state,
                message: action.payload.message,
                messageCount: state.messageCount + 1,
            };
        },
        setCount: (state, action) => {
            return {
                ...state,
                messageCount: action.payload.count,
            };
        },
        resetCount: state => {
            return {
                ...state,
                message: '',
                messageCount: 0,
            };
        },
    },
});

export const { setSseConnected, setMessage, setCount, resetCount } = sseSlice.actions;

export default sseSlice.reducer;
