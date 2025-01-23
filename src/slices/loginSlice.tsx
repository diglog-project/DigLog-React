import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isLogin: false,
    accessToken: "",
    email: "",
    username: "",
    roles: [],
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
    }
});

export const {login, logout} = loginSlice.actions;

export default loginSlice.reducer;