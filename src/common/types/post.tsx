import {PageResponse} from "./common.tsx";

export interface PostRequest {
    title: string,
    content: string,
    tagNames: string[],
    urls: string[],
}

export interface PostUpdateRequest {
    id: string,
    title: string,
    content: string,
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

export interface PostListResponse {
    content: PostResponse[];
    page: PageResponse;
}

export interface PostResponse {
    id: string;
    title: string;
    content: string;
    username: string;
    tags: TagResponse[];
    createdAt: Date;
}

export interface TagResponse {
    id: string;
    name: string;
}

