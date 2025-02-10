import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isLogin: true,
    accessToken: "token",
    email: "diglog@example.com",
    username: "diglog",
    roles: ["ROLE_USER"],
}

const loginSlice = createSlice({
    name: "loginSlice",
    initialState: initialState,
    reducers: {
        login: (_, action) => {
            return {
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
    }
});

export const {login, logout, setUsername} = loginSlice.actions;

export default loginSlice.reducer;