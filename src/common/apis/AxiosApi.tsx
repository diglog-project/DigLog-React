import axios from 'axios';
import store from '../../store.tsx';
import { login } from '../slices/loginSlice.tsx';

const axiosApi = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

axiosApi.interceptors.request.use(
    config => {
        config.headers['Authorization'] = store.getState().loginSlice.accessToken;
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

axiosApi.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status >= 401 && error.response.status <= 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axiosApi.get('/member/refresh', { withCredentials: true });

                if (refreshResponse.data.status === 200) {
                    store.dispatch(
                        login({
                            email: refreshResponse.data.email,
                            username: refreshResponse.data.username,
                            roles: refreshResponse.data.roles,
                            accessToken: refreshResponse.headers.authorization,
                        }),
                    );
                } else {
                    return Promise.reject();
                }

                return await axiosApi({
                    ...originalRequest,
                });
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosApi;
