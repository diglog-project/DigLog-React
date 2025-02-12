import axiosApi from "./AxiosApi.tsx";
import {PostRequest} from "../types/post.tsx";

export const createPost = async (postRequest: PostRequest) =>
    await axiosApi.post("/post", postRequest);

export const getPost = async (id: string) =>
    await axiosApi.get(`/post/${id}`);
