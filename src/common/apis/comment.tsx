import axiosApi from "./AxiosApi.tsx";
import {CommentListRequest, CommentRequest} from "../types/comment.tsx";
import {commentListRequestToParameter} from "../util/url.tsx";

export const getComments = async (commentListRequest: CommentListRequest) =>
    await axiosApi.get(`/comment${commentListRequestToParameter(commentListRequest)}`);

export const saveComment = async (commentRequest: CommentRequest) =>
    await axiosApi.post(`/comment`, commentRequest);