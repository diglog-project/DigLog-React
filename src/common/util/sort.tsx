import {TagResponse} from "../types/post.tsx";

export const sortByName = (names: string[]) => {
    names.sort((a: string, b: string) => {
        if (a < b) return -1;
        else if (a > b) return 1;
        return 0;
    });
    return names;
}

export const sortTagByName = (tags: TagResponse[]) => {
    tags.sort((a: TagResponse, b: TagResponse) => {
        if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        return 0;
    });
    return tags;
}