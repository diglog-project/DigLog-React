import { PostListRequest, PostListTagRequest, PostSearchRequest } from '../types/post.tsx';
import { CommentListRequest } from '../types/comment.tsx';
import { PostListMemberRequest } from '../types/blog.tsx';
import { MemberProfileSearchRequest } from '../types/member.tsx';

export const postListRequestToParameter = (postListRequest: PostListRequest) => {
    const sorts = postListRequest.sorts.map(sort => `sorts=${sort}`).join('&');

    return `?${sorts}&page=${postListRequest.page}&size=${postListRequest.size}&isDescending=${postListRequest.isDescending}`;
};

export const postListMemberRequestToParameter = (postListMemberRequest: PostListMemberRequest) => {
    let query = `?username=${postListMemberRequest.username}&page=${postListMemberRequest.page}&size=${postListMemberRequest.size}`;

    if (!postListMemberRequest.folderIds) {
        return query;
    }

    postListMemberRequest.folderIds.forEach((folderId: string) => {
        query += `&folderIds=${folderId}`;
    });

    return query;
};

export const postListSearchRequestToParameter = (postSearchRequest: PostSearchRequest) => {
    const sorts = postSearchRequest.sorts.map(sort => `sorts=${sort}`).join('&');

    return `?${sorts}&keyword=${postSearchRequest.keyword}&option=${postSearchRequest.option}&page=${postSearchRequest.page}&size=${postSearchRequest.size}&isDescending=${postSearchRequest.isDescending}`;
};

export const postListTagRequestToParameter = (postListTagRequest: PostListTagRequest) => {
    return `?username=${postListTagRequest.username}&tagId=${postListTagRequest.tagId}&page=${postListTagRequest.page}&size=${postListTagRequest.size}`;
};

export const memberProfileSearchRequestToParameter = (memberProfileSearchRequest: MemberProfileSearchRequest) => {
    return `?username=${memberProfileSearchRequest.username}&page=${memberProfileSearchRequest.page}&size=${memberProfileSearchRequest.size}`;
};

export const commentListRequestToParameter = (commentListRequest: CommentListRequest) => {
    let query = `?postId=${commentListRequest.postId}&page=${commentListRequest.page}&size=${commentListRequest.size}`;

    if (commentListRequest.parentCommentId) {
        query += `&parentCommentId=${commentListRequest.parentCommentId}`;
    }

    return query;
};
