import {PostListRequest} from "../types/post.tsx";
import {CommentListRequest} from "../types/comment.tsx";
import {PostListMemberRequest} from "../types/blog.tsx";

export const postListRequestToParameter = (postListRequest: PostListRequest) => {
    const sorts = postListRequest.sorts.map(sort => `sorts=${sort}`).join("&");

    return `?${sorts}&page=${postListRequest.page}&size=${postListRequest.size}&isDescending=${postListRequest.isDescending}`;
}

export const commentListRequestToParameter = (commentListRequest: CommentListRequest) => {
    let query = `?postId=${commentListRequest.postId}&page=${commentListRequest.page}&size=${commentListRequest.size}`;

    if (commentListRequest.parentCommentId) {
        query += `&parentCommentId=${commentListRequest.parentCommentId}`;
    }

    return query;
}

export const postListMemberRequestToParameter = (postListMemberRequest: PostListMemberRequest) => {
    let query =`?username=${postListMemberRequest.username}&page=${postListMemberRequest.page}&size=${postListMemberRequest.size}`;

    if (postListMemberRequest.folderId) {
        query += `&folderId=${postListMemberRequest.folderId}`;
    }

    return query;
}