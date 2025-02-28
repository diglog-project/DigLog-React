import {PostListRequest} from "../types/post.tsx";
import {CommentListRequest} from "../types/comment.tsx";

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
