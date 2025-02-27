import {PostListRequest} from "../types/post.tsx";
import {CommentRequest} from "../types/comment.tsx";

export const postListRequestToParameter = (postListRequest: PostListRequest) => {
    const sorts = postListRequest.sorts.map(sort => `sorts=${sort}`).join("&");

    return `?${sorts}&page=${postListRequest.page}&size=${postListRequest.size}&isDescending=${postListRequest.isDescending}`;
}

export const commentRequestToParameter = (commentRequest: CommentRequest) => {
    let query = `?postId=${commentRequest.postId}&page=${commentRequest.page}&size=${commentRequest.size}`;

    if (commentRequest.parentCommentId) {
        query += `&parentCommentId=${commentRequest.parentCommentId}`;
    }

    return query;
}
