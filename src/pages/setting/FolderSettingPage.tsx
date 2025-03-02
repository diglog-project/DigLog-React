import {useEffect, useRef, useState} from "react";
import {FolderType, toFolderRequestList, toFolderTypeList} from "../../common/types/blog.tsx";
import {FillButton} from "../../components/common/FillButton.tsx";
import ModalLayout from "../../layout/ModalLayout.tsx";
import {DragEndEvent} from "@dnd-kit/core";
import FolderCardList from "../../components/folder/FolderCardList.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import FolderSelectBox from "../../components/folder/FolderSelectBox.tsx";
import {saveAndUpdateFolder} from "../../common/apis/blog.tsx";
import {useNavigate} from "react-router-dom";

function FolderSettingPage() {

    const navigate = useNavigate();

    const [tempId, setTempId] = useState(0);
    const [folders, setFolders] = useState<FolderType[]>(toFolderTypeList([]));

    const getTempId = () => {
        setTempId(prev => prev + 1);
        return `temp${tempId}`;
    }

    const addFolder = (parentFolder: FolderType | null) => {
        const tempTitle = `폴더_${crypto.randomUUID().substring(0, 4)}`;

        if (parentFolder === null) {
            const tempId = getTempId();
            setFolders([...folders, {id: tempId, title: tempTitle, subFolders: []}]);
            setEditFolderTitle("");
            setEditFolderId(tempId);
            return;
        }

        setFolders(prevFolders => getAddFolderList(prevFolders, parentFolder.id, tempTitle));
    }
    const getAddFolderList = (folders: FolderType[], id: string, title: string) => {
        return folders.map((folder: FolderType): FolderType => {
            if (folder.id === id) {
                const tempId = getTempId();
                setEditFolderTitle("");
                setEditFolderId(tempId);
                return {...folder, subFolders: [...folder.subFolders, {id: tempId, title: title, subFolders: []}]};
            } else if (folder.subFolders.length > 0) {
                return {...folder, subFolders: getAddFolderList(folder.subFolders, id, title)};
            }
            return folder;
        });
    }

    const [openMoveModal, setOpenMoveModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<FolderType>({
        id: crypto.randomUUID(),
        title: "",
        subFolders: [],
    });
    const [editFolderId, setEditFolderId] = useState("");
    const [editFolderTitle, setEditFolderTitle] = useState("");
    const [targetFolder, setTargetFolder] = useState<FolderType>({
        id: crypto.randomUUID(),
        title: "",
        subFolders: [],
    });
    const [folderMoveType, setFolderMoveType] = useState(0);
    const folderMoveTypes = ["폴더 위로 옮깁니다.", "폴더 아래로 옮깁니다.", "폴더 내부로 옮깁니다."];

    const handleMoveFolder = () => {
        if (handleDisabled(folderMoveType)) {
            alert("활성화된 동작 중에서 선택해주세요.");
            return;
        }

        if (folderMoveType === 2) {
            setFolders(prevFolders => {
                const deleteFolderList = getDeleteFolderList(prevFolders, selectedFolder.id);
                return getAddFolderModalList(deleteFolderList);
            });
        } else {
            setFolders(prevFolders => {
                const deleteFolderList = getDeleteFolderList(prevFolders, selectedFolder.id);
                return getModalMoveFolderList(deleteFolderList);
            });
        }

        setOpenMoveModal(false);
    }
    const getModalMoveFolderList = (folders: FolderType[]) => {
        const targetIndex = folders.findIndex((folder) => folder.id === targetFolder.id);

        if (targetIndex !== -1) {
            const moveIndex = (folderMoveType === 0) ? targetIndex : targetIndex + 1;
            return folders.slice(0, moveIndex).concat(selectedFolder, folders.slice(moveIndex));
        }
        return folders.map((folder: FolderType): FolderType => {
            if (folder.subFolders.length > 0) {
                return {...folder, subFolders: getModalMoveFolderList(folder.subFolders)};
            }
            return folder;
        });
    }
    const getAddFolderModalList = (folders: FolderType[]) => {
        return folders.map((folder: FolderType): FolderType => {
            if (folder.id === targetFolder.id) {
                return {...folder, subFolders: [...folder.subFolders, selectedFolder]};
            } else if (folder.subFolders.length > 0) {
                return {...folder, subFolders: getAddFolderModalList(folder.subFolders)};
            }
            return folder;
        });
    }

    const handleOnDragEnd = ({active, over}: DragEndEvent) => {
        if (!over || active.id === over.id) {
            return;
        }

        setFolders(prevFolders => getMoveFolderList(prevFolders, active.id as string, over.id as string));
    }
    const getMoveFolderList = (folders: FolderType[], activeId: string, overId: string) => {
        const activeIndex = folders.findIndex(folder => folder.id === activeId);
        const overIndex = folders.findIndex(folder => folder.id === overId);

        if (activeIndex !== -1 && overIndex !== -1) {
            return arrayMove(folders, activeIndex, overIndex);
        }
        return folders.map((folder: FolderType): FolderType => {
            if (folder.subFolders.length > 0) {
                return {...folder, subFolders: getMoveFolderList(folder.subFolders, activeId, overId)};
            }
            return folder;
        });
    }

    const handleDisabled = (moveType: number) => {
        if (targetFolder.title === "") {
            return true;
        }

        const maxDepth = 2;

        const selectedFolderMaxDepth = getMaxFolderDepth(folders, selectedFolder.id) || 1;
        const selectedFolderDepth = getFolderDepth(folders, selectedFolder.id) || 1;
        const targetFolderDepth = getFolderDepth(folders, targetFolder.id) || 1;
        if (moveType === 2) {
            return selectedFolderMaxDepth + targetFolderDepth > maxDepth;
        } else {
            return selectedFolderMaxDepth - selectedFolderDepth + targetFolderDepth > maxDepth;
        }
    }
    // 하위 폴더의 최대 깊이
    const getMaxFolderDepth = (folders: FolderType[], folderId: string, currentDepth: number = 1): number | null => {
        for (const folder of folders) {
            if (folder.id === folderId) {
                return calculateMaxDepth(folder.subFolders);
            }

            const depth = getMaxFolderDepth(folder.subFolders, folder.id, currentDepth + 1);
            if (depth !== null) {
                return depth;
            }
        }

        return null;
    }
    const calculateMaxDepth = (folders: FolderType[]): number => {
        if (folders.length === 0) return 0;

        const depths = folders.map(folder => 1 + calculateMaxDepth(folder.subFolders));
        return Math.max(...depths);
    };
    // 폴더의 현재 깊이
    const getFolderDepth = (folders: FolderType[], targetId: string, currentDepth: number = 1): number | null => {
        for (const folder of folders) {
            if (folder.id === targetId) {
                return currentDepth;
            }

            const depth = getFolderDepth(folder.subFolders, targetId, currentDepth + 1);
            if (depth !== null) {
                return depth;
            }
        }

        return null;
    };

    const handleEdit = (editFolder: FolderType) => {
        if (editFolder.title.trim() === "") {
            alert("폴더 이름을 입력해주세요.");
            return;
        }

        const handleFolders = getHandleFolders(folders, editFolder.id);
        console.log("handleFolders", handleFolders);
        console.log("targetId", editFolder.id);
        if (handleFolders.findIndex(folder => folder.title === editFolderTitle.trim()) !== -1) {
            alert("중복된 폴더 이름입니다.");
            return;
        }

        setFolders(prevFolders => getEditFolderList(prevFolders, editFolder.id, editFolder.title));
        setEditFolderId("");
    }
    const getHandleFolders = (folders: FolderType[], targetId: string): FolderType[] => {
        for (const folder of folders) {
            if (folder.id === targetId) {
                return folders;
            }

            if (folder.subFolders) {
                const subResult = getHandleFolders(folder.subFolders, targetId);
                if (subResult.length > 0) {
                    return subResult;
                }
            }
        }

        return [];
    }
    const getEditFolderList = (folders: FolderType[], id: string, title: string) => {
        return folders.map((folder: FolderType): FolderType => {
            if (folder.id === id) {
                return {...folder, title: title};
            } else if (folder.subFolders.length > 0) {
                return {...folder, subFolders: getEditFolderList(folder.subFolders, id, title)};
            }
            return folder;
        })
    }

    const handleDelete = (deleteFolder: FolderType) => {
        if (deleteFolder.subFolders.length > 0) {
            alert("하위 폴더를 모두 제거한 후에 제거할 수 있습니다.");
            return;
        }

        setFolders(prevFolders => getDeleteFolderList(prevFolders, deleteFolder.id));
    }
    const getDeleteFolderList = (folders: FolderType[], id: string) => {
        if (folders.findIndex(folder => folder.id === id) !== -1) {
            return folders.filter(folder => folder.id !== id);
        }

        return folders.map((folder: FolderType): FolderType => {
            if (folder.subFolders.length > 0) {
                return {...folder, subFolders: getDeleteFolderList(folder.subFolders, id)};
            }
            return folder;
        })
    }

    const handleSubmit = () => {
        if (!confirm("변경사항을 저장하시겠습니까?")) {
            return;
        }

        saveAndUpdateFolder(toFolderRequestList(folders))
            .then((res) => {
                console.log(res);
                alert("변경사항이 저장되었습니다.");
                navigate(0);
            })
            .catch(error => alert(error.response.data.message));
    }

    const modalRef = useRef<HTMLDivElement | null>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setOpenMoveModal(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setTargetFolder({...targetFolder, title: ""});
    }, [openMoveModal]);

    return (
        <div>
            <p className="font-semibold text-xl my-4">폴더 관리</p>
            <FolderCardList
                folders={folders}
                editFolderId={editFolderId}
                editFolderTitle={editFolderTitle}
                setEditFolderId={setEditFolderId}
                setEditFolderTitle={setEditFolderTitle}
                handleEdit={handleEdit}
                addFolder={addFolder}
                handleOnDragEnd={handleOnDragEnd}
                handleDelete={handleDelete}
                setOpenMoveModal={setOpenMoveModal}
                setSelectedFolder={setSelectedFolder}/>
            <button className="w-full border border-gray-400 h-12 px-4 my-4 text-sm hover:cursor-pointer"
                    onClick={() => addFolder(null)}>
                폴더 추가
            </button>
            <div className="flex justify-end">
                <FillButton text={"변경사항 저장"} onClick={handleSubmit} addStyle={"text-sm"}/>
            </div>
            {openMoveModal && (
                <ModalLayout addStyle={"!w-128"} customRef={modalRef}>
                    <div className="w-full h-full">
                        <div className="flex flex-col justify-center items-center gap-y-8">
                            <p><span className="font-bold">{selectedFolder.title}</span> 폴더를</p>
                            <FolderSelectBox
                                folders={folders}
                                selectedFolder={selectedFolder}
                                targetFolder={targetFolder}
                                setTargetFolder={setTargetFolder}
                                center={true}
                            />
                            <ul className="flex flex-col justify-center items-center gap-y-2 mb-4">
                                {folderMoveTypes.map((moveType, index) =>
                                    <li key={index}
                                        className="w-48 flex justify-start items-center gap-x-4">
                                        <input
                                            key={`folder-radio-${index}`}
                                            className="size-4"
                                            id={`folderMoveType${index}`}
                                            type="radio"
                                            value={index}
                                            checked={folderMoveType === index}
                                            onChange={() => setFolderMoveType(index)}
                                            disabled={handleDisabled(index)}/>
                                        <label key={`folder-radio-label-${index}`}
                                               className={`${handleDisabled(index) && "text-gray-400"}`}
                                               htmlFor={`folderMoveType${index}`}>{moveType}</label>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="flex justify-center items-center gap-x-4">
                            <FillButton text={"취소"} onClick={() => {
                                setOpenMoveModal(false);
                            }}/>
                            <FillButton text={"이동"} onClick={handleMoveFolder}
                                        addStyle={(handleDisabled(folderMoveType) ? "opacity-40 hover:!cursor-auto" : "")}/>
                        </div>
                    </div>
                </ModalLayout>
            )}
        </div>
    );
}

export default FolderSettingPage;