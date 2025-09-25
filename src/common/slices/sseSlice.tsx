import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sseConnected: false,
    message: '',
    messageCount: 0,
    trigger: false, // 알림 설정 페이지 새로고침용
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
            };
        },
        addCount: state => {
            return {
                ...state,
                messageCount: state.messageCount + 1,
            };
        },
        subtractCount: state => {
            return {
                ...state,
                messageCount: state.messageCount - 1,
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
        setTrigger: state => {
            return {
                ...state,
                trigger: !state.trigger,
            };
        },
    },
});

export const { setSseConnected, setMessage, addCount, subtractCount, setCount, resetCount, setTrigger } =
    sseSlice.actions;

export default sseSlice.reducer;
