import {PageResponse} from "./common.tsx";

export interface PostRequest {
    title: string,
    content: string,
    folderId: string | null,
    tagNames: string[],
    urls: string[],
}

export interface PostUpdateRequest {
    id: string,
    title: string,
    content: string,
    folderId: string | null,
    tagNames: string[],
    urls: string[],
}

export interface PostListRequest {
    sorts: string[],
    page: number,
    size: number,
    isDescending: boolean,
}

export interface PostSearchRequest {
    keyword: string,
    option: string,
    sorts: string[],
    page: number,
    size: number,
    isDescending: boolean,
}

export interface PostListTagRequest {
    username: string,
    tagId: string,
    page: number,
    size: number,
}

export interface PostListResponse {
    content: PostResponse[];
    page: PageResponse;
}

export interface PostResponse {
    id: string;
    title: string;
    content: string;
    username: string;
    folder?: PostFolderResponse;
    tags: TagResponse[];
    viewCount: number;
    createdAt: Date;
}

export interface PostFolderResponse {
    id: string;
    title: string;
}

export interface TagResponse {
    id: string;
    name: string;
}

export interface PostFolderRequest {
    postIds: string[],
    folderId: string | null,
}
