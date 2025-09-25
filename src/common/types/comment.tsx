import { PageResponse } from './common.tsx';

export interface CommentType {
    id: string;
    member: CommentMember;
    content: string;
    taggedUsername: string | null;
    replyCount: number;
    createdAt: Date;
    deleted: boolean;
    subComments: CommentType[];
}

export interface CommentListRequest {
    postId: string;
    parentCommentId: string | null;
    page: number;
    size: number;
}

export interface CommentListResponse {
    content: CommentResponse[];
    page: PageResponse;
}

export interface CommentResponse {
    id: string;
    member: CommentMember;
    content: string;
    taggedUsername: string | null;
    replyCount: number;
    createdAt: Date;
    deleted: boolean;
}

export interface CommentMember {
    username: string;
    profileUrl: string | null;
}

export interface CommentRequest {
    content: string;
    postId: string;
    parentCommentId: string | null;
    taggedUsername: string | null;
}

export interface CommentUpdateRequest {
    id: string;
    content: string;
    taggedUsername: string | null;
}
