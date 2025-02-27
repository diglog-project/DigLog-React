import axiosApi from "./AxiosApi.tsx";
import {CommentRequest} from "../types/comment.tsx";
import {commentRequestToParameter} from "../util/url.tsx";

export const getComments = async (commentRequest: CommentRequest) =>
    await axiosApi.get(`/comment${commentRequestToParameter(commentRequest)}`);