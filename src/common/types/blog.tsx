export interface FolderRequest {
    id: string | null,
    title: string,
    depth: number,
    orderIndex: number,
    parentOrderIndex: number,
}

export interface FolderType {
    id: string,
    title: string,
    subFolders: FolderType[],
}

export interface FolderResponse {
    folderId: string,
    title: string,
    depth: number,
    orderIndex: number,
    parentFolderId: string | null,
}

export const toFolderTypeList = (folderResponseList: FolderResponse[]) => {
    const result: FolderType[] = [];

    folderResponseList.sort((a, b) => a.orderIndex - b.orderIndex)
        .forEach(folderResponse => {
            const folderType = toFolderType(folderResponse);

            if (folderResponse.depth === 0) {
                result.push(folderType);
            } else if (folderResponse.depth === 1) {
                result[result.length - 1].subFolders.push(folderType);
            } else if (folderResponse.depth === 2) {
                const subFoldersLength = result[result.length - 1].subFolders.length;
                result[result.length - 1].subFolders[subFoldersLength - 1].subFolders.push(folderType);
            }
        });

    return result;
}

const toFolderType = (folderResponse: FolderResponse) => {
    return {
        id: folderResponse.folderId,
        title: folderResponse.title,
        subFolders: [],
    };
}

export const toFolderRequestList = (folderTypeList: FolderType[]) => {
    const result: FolderRequest[] = [];

    const getFolderRequestList = (folderTypeList: FolderType[], depth: number = 0, parentIndex: number = -1) => {
        folderTypeList.forEach(folder => {
            const id = (!folder.id.startsWith("temp") ? folder.id : null);
            result.push({
                id: id,
                title: folder.title,
                depth: depth,
                orderIndex: result.length,
                parentOrderIndex: parentIndex,
            });

            if (folder.subFolders.length > 0) {
                getFolderRequestList(folder.subFolders, depth + 1, result.length - 1);
            }
        });
    }

    getFolderRequestList(folderTypeList);

    return result;
}

export interface PostListMemberRequest {
    username: string,
    folderIds: string[] | null,
    page: number,
    size: number,
}