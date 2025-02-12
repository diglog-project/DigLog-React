import {PostListRequest} from "../types/post.tsx";

export const postListRequestToParameter = (postListRequest: PostListRequest)=> {
    const sorts = postListRequest.sorts.map(sort => `sorts=${sort}`).join("&");

    return `?${sorts}&page=${postListRequest.page}&size=${postListRequest.size}&isDescending=${postListRequest.isDescending}`;
}