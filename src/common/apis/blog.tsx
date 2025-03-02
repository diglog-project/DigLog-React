import {FolderRequest} from "../types/blog.tsx";
import axiosApi from "./AxiosApi.tsx";

export const saveAndUpdateFolder = (folderRequestList: FolderRequest[]) =>
    axiosApi.put("/folders", folderRequestList);