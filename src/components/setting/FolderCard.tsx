import {FillButton} from "../common/FillButton.tsx";
import {MdOutlineMenu} from "react-icons/md";
import {TextButton} from "../common/TextButton.tsx";
import {FolderResponse} from "../../common/types/blog.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

function FolderCard({
                        folder,
                        editFolderId,
                        editFolderTitle,
                        setEditFolderId,
                        setEditFolderTitle,
                        handleEdit,
                        addFolder,
                        handleDelete,
                        setSelectedFolder,
                        setOpenMoveModal
                    }: {
    folder: FolderResponse,
    editFolderId: string,
    editFolderTitle: string,
    setEditFolderId: (editFolderId: string) => void,
    setEditFolderTitle: (editFolderTitle: string) => void,
    handleEdit: (editFolder: FolderResponse) => void,
    addFolder: (targetFolder: FolderResponse, editTitle: string) => void,
    handleDelete: (deleteFolder: FolderResponse) => void,
    setOpenMoveModal: (openMoveModal: boolean) => void,
    setSelectedFolder: (selectedFolder: FolderResponse) => void,
}) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: folder.id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div key={folder.id} ref={setNodeRef} style={style}
             className={`ml-${folder.depth * 8 - 8} ${folder.depth === 0 && "hidden"} flex justify-between items-center h-16 px-4 my-0.5 border border-gray-300 hover:border-gray-400 text-sm`}>
             {folder.id === editFolderId
                 ? <div className="w-full flex justify-between items-center gap-x-4">
                     <input
                         className={"flex-1 font-bold border p-2"}
                         value={editFolderTitle}
                         onChange={(e) => setEditFolderTitle(e.target.value)}
                         placeholder="폴더 이름"/>
                     <div className="flex items-center gap-x-2">
                         <FillButton text={"취소"}
                                     onClick={() => setEditFolderId("")}
                                     addStyle={"!bg-gray-400 hover:brightness-110"}/>
                         <FillButton text={"수정"}
                                     onClick={() => handleEdit({...folder, title: editFolderTitle})}/>
                     </div>
                 </div>
                 : <div className="w-full flex justify-between items-center ">
                     <div className="flex items-center gap-x-4">
                         <MdOutlineMenu {...attributes} {...listeners}
                                        className="hover:cursor-pointer text-gray-600"/>
                         <p>{folder.parentOrder} {folder.order} {folder.title}</p>
                     </div>
                     <div className="flex justify-end items-center">
                         {folder.depth <= 1 &&
                             <TextButton text={"추가"}
                                         onClick={() => addFolder(folder, `폴더_${crypto.randomUUID().substring(0, 4)}`)}
                                         addStyle={"text-xs hover:text-lime-600"}/>}
                         <TextButton text={"수정"} onClick={() => {
                             setEditFolderId(folder.id);
                             setEditFolderTitle(folder.title);
                         }} addStyle={"text-xs hover:text-lime-600"}/>
                         <TextButton text={"삭제"} onClick={() => {
                             handleDelete(folder);
                         }} addStyle={"text-xs hover:text-lime-600"}/>
                         <TextButton text={"이동"} onClick={() => {
                             setOpenMoveModal(true);
                             setSelectedFolder(folder);
                         }} addStyle={"text-xs hover:text-lime-600"}/>
                     </div>
                 </div>}
        </div>
    );
}

export default FolderCard;