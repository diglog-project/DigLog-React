import {PageResponse} from "./common.tsx";

export interface PostRequest {
    title: string,
    content: string,
    tagNames: string[],
    urls: string[],
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

