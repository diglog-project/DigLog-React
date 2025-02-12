import axiosApi from "./AxiosApi.tsx";

export const uploadImage = async (blogInfo: any) => {
    const formData = new FormData();
    formData.append("file", blogInfo.blob());

    return await axiosApi.post("/image", formData);
}
