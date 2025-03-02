import {FolderRequest, PostListMemberRequest} from "../types/blog.tsx";
import axiosApi from "./AxiosApi.tsx";
import {postListMemberRequestToParameter} from "../util/url.tsx";

export const getMemberPosts = (postListMemberRequest: PostListMemberRequest) =>
    axiosApi.get(`/post/member${postListMemberRequestToParameter(postListMemberRequest)}`);

export const saveAndUpdateFolder = (folderRequestList: FolderRequest[]) =>
    axiosApi.put("/folders", folderRequestList);