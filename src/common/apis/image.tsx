import axiosApi from './AxiosApi.tsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadImage = async (blogInfo: any) => {
    const formData = new FormData();
    formData.append('file', blogInfo.blob());

    return await axiosApi.post('/image', formData);
};
