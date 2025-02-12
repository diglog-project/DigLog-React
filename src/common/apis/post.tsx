import axiosApi from "./AxiosApi.tsx";
import {PostListRequest, PostRequest, PostUpdateRequest} from "../types/post.tsx";
import {postListRequestToParameter} from "../util/url.tsx";

export const createPost = async (postRequest: PostRequest) =>
    await axiosApi.post("/post", postRequest);

export const updatePost = async (postUpdateRequest: PostUpdateRequest) =>
    await axiosApi.patch(`/post`, postUpdateRequest);

export const deletePost = async (id: string) =>
    await axiosApi.patch(`/post/delete/${id}`);

export const getPost = async (id: string) =>
    await axiosApi.get(`/post/${id}`);

export const getPosts = async (postListRequest: PostListRequest) =>
    await axiosApi.get(`/post${postListRequestToParameter(postListRequest)}`);
