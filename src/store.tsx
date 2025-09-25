import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './common/slices/loginSlice.tsx';
import sseSlice from './common/slices/sseSlice.tsx';

const store = configureStore({
    reducer: {
        loginSlice: loginSlice,
        sseSlice: sseSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
