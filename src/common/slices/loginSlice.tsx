import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLogin: false,
    isReloaded: true,
    sseConnected: false,
    accessToken: '',
    email: '',
    username: '',
    profileUrl: '',
    roles: [],
};

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            return {
                ...state,
                isLogin: !!action.payload.email,
                accessToken: action.payload.accessToken,
                email: action.payload.email,
                username: action.payload.username,
                roles: action.payload.roles,
            };
        },
        logout: () => {
            return initialState;
        },
        setUsername: (state, action) => {
            return {
                ...state,
                username: action.payload.username,
            };
        },
        setProfile: (state, action) => {
            return {
                ...state,
                isReloaded: false,
                email: action.payload.email,
                username: action.payload.username,
                profileUrl: action.payload.profileUrl,
            };
        },
        setReloadedFalse: state => {
            return {
                ...state,
                isReloaded: false,
            };
        },
        setSseConnected: (state, action) => {
            return {
                ...state,
                sseConnected: action.payload.sseConnected,
            };
        },
    },
});

export const { login, logout, setUsername, setProfile, setReloadedFalse, setSseConnected } = loginSlice.actions;

export default loginSlice.reducer;
