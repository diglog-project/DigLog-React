import axiosApi from "./AxiosApi.tsx";
import {PostFolderRequest, PostListRequest, PostRequest, PostSearchRequest, PostUpdateRequest} from "../types/post.tsx";
import {postListRequestToParameter, postListSearchRequestToParameter} from "../util/url.tsx";

export const createPost = async (postRequest: PostRequest) =>
    await axiosApi.post("/post", postRequest);

export const updatePost = async (postUpdateRequest: PostUpdateRequest) =>
    await axiosApi.patch("/post", postUpdateRequest);

export const updatePostFolder = async (postFolderRequest: PostFolderRequest) =>
    await axiosApi.patch("/post/folder", postFolderRequest);

export const deletePost = async (id: string) =>
    await axiosApi.patch(`/post/delete/${id}`);

export const getPost = async (id: string) =>
    await axiosApi.get(`/post/${id}`);

export const getPosts = async (postListRequest: PostListRequest) =>
    await axiosApi.get(`/post${postListRequestToParameter(postListRequest)}`);

export const searchPost = async (postSearchRequest: PostSearchRequest) =>
    await axiosApi.get(`/post/search${postListSearchRequestToParameter(postSearchRequest)}`);