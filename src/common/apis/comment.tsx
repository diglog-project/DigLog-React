import axiosApi from "./AxiosApi.tsx";
import {CommentListRequest, CommentRequest, CommentUpdateRequest} from "../types/comment.tsx";
import {commentListRequestToParameter} from "../util/url.tsx";

export const getComments = async (commentListRequest: CommentListRequest) =>
    await axiosApi.get(`/comment${commentListRequestToParameter(commentListRequest)}`);

export const saveComment = async (commentRequest: CommentRequest) =>
    await axiosApi.post("/comment", commentRequest);

export const updateComment = async (commentUpdateRequest: CommentUpdateRequest) => {
    await axiosApi.patch("/comment", commentUpdateRequest);
}

export const deleteComment = async (id: string) =>
    await axiosApi.patch(`/comment/delete/${id}`);