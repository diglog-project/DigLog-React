import {faker} from "@faker-js/faker/locale/ko";
import {useEffect, useRef, useState} from "react";
import {FolderResponse} from "../../common/types/blog.tsx";
import {FillButton} from "../../components/common/FillButton.tsx";
import ModalLayout from "../../layout/ModalLayout.tsx";
import CategorySelectBox from "../../components/blog/CategorySelectBox.tsx";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import FolderCard from "../../components/setting/FolderCard.tsx";
import {FolderRequest, testApi} from "../../common/apis/post.tsx";

function FolderSettingPage() {

    const folderData: FolderResponse[] = [
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 1,
            order: 1,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: "DigLog의 블로그",
            depth: 0,
            order: 0,
            parentOrder: -1,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 1,
            order: 0,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 1,
            order: 3,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 0,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 1,
            parentOrder: 1,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 2,
            parentOrder: 1,
        },

        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 0,
            parentOrder: 3,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 1,
            order: 2,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 0,
            parentOrder: 1,
        },
    ];

    const sortFolders = (folders: FolderResponse[]) => {
        const result: FolderResponse[] = [];

        const rootFolder = folders.findIndex(folder => folder.depth === 0);
        result.push(folders[rootFolder]);

        const mainFolders = folders.filter((folder) =>
            folder.depth === 1 && folder.parentOrder === 0)
            .sort((a, b) => a.order - b.order);

        mainFolders.forEach((folder) => {
            result.push(folder);

            const subFolders = folders.filter((subFolder) =>
                subFolder.depth === 2 && subFolder.parentOrder === folder.order)
                .sort((a, b) => a.order - b.order);
            result.push(...subFolders);
        });

        return result;
    };

    const [folders, setFolders] = useState<FolderResponse[]>(sortFolders(folderData));

    const addFolder = (parentFolder: FolderResponse, title: string) => {
        if (parentFolder.depth >= 2) {
            return;
        }

        const id = crypto.randomUUID();
        const subFolders = folders.filter(folder =>
            folder.depth === parentFolder.depth + 1 && folder.parentOrder === parentFolder.order);
        const maxOrder = subFolders.reduce((max, folder) => {
            return folder.order > max ? folder.order : max;
        }, -1);

        const newFolder: FolderResponse = {
            id: id,
            title: title,
            depth: parentFolder.depth + 1,
            order: maxOrder + 1,
            parentOrder: parentFolder.order,
        };

        setEditFolderId(id);
        setEditFolderTitle("");
        setFolders(sortFolders([...folders, newFolder]));
    }

    const moveFolder = (moveFolder: FolderResponse, targetFolder: FolderResponse) => {
        // maxDepth 초과하는 경우 return
        if (targetFolder.depth === 2 && moveFolder.depth === 1 &&
            folders.findIndex(folder => folder.depth === 2 && folder.parentOrder === moveFolder.order) !== -1) {
            alert("하위 폴더를 이동한 후에 이동해주세요.");
            return;
        }

        const moveFolders: FolderResponse[] = [];
        const anotherFolders: FolderResponse[] = [];

        // 이동할 폴더 분리
        folders.forEach(folder => {
            if (folder.depth === 0) {
                moveFolders.push(folder);
            } else if (folder.depth === moveFolder.depth && folder.parentOrder === moveFolder.parentOrder && folder.order === moveFolder.order) {
                moveFolders.push({
                    ...folder,
                    depth: targetFolder.depth,
                    order: targetFolder.order,
                    parentOrder: targetFolder.parentOrder,
                });
            } else if (folder.depth > moveFolder.depth && folder.parentOrder === moveFolder.order) {
                moveFolders.push({
                    ...folder,
                    parentOrder: targetFolder.order,
                });
            } else {
                anotherFolders.push(folder);
            }
        });

        setFolders(sortFolders([...anotherFolders, ...moveFolders]));

        // anotherFolders.forEach((folder) => {
        //     if (moveFolder.depth === 2 && targetFolder.depth === 2) {
        //         if (folder.depth === 2 && moveFolder.parentOrder === targetFolder.parentOrder && folder.parentOrder === moveFolder.parentOrder) {
        //             if (folder.order > moveFolder.order && folder.order <= targetFolder.order) {
        //                 resultFolders.push({...folder, order: --folder.order});
        //             } else if (folder.order < moveFolder.order && folder.order >= targetFolder.order) {
        //                 resultFolders.push({...folder, order: ++folder.order});
        //             } else {
        //                 resultFolders.push(folder);
        //             }
        //         } else if (folder.depth === 2 && moveFolder.parentOrder !== targetFolder.parentOrder) {
        //             if (folder.parentOrder === moveFolder.parentOrder && folder.order > moveFolder.order) {
        //                 resultFolders.push({...folder, order: --folder.order});
        //             } else if (folder.parentOrder === targetFolder.parentOrder && folder.order >= targetFolder.order) {
        //                 resultFolders.push({...folder, order: ++folder.order});
        //             } else {
        //                 resultFolders.push(folder);
        //             }
        //         } else {
        //             resultFolders.push(folder);
        //         }
        //     } else if (moveFolder.depth === 2 && targetFolder.depth === 1) {
        //         if (folder.depth === 2 && folder.parentOrder >= targetFolder.order) {
        //             resultFolders.push({...folder, parentOrder: ++folder.parentOrder});
        //         } else if (folder.depth === 2 && folder.parentOrder === moveFolder.parentOrder && folder.order > moveFolder.order) {
        //             resultFolders.push({...folder, order: --folder.order});
        //         } else if (folder.depth === 1 && folder.order >= targetFolder.order) {
        //             resultFolders.push({...folder, order: ++folder.order});
        //         } else {
        //             resultFolders.push(folder);
        //         }
        //     } else if (moveFolder.depth === 1 && targetFolder.depth === 2) {
        //         if (folder.depth === 1 && folder.order > moveFolder.order) {
        //             resultFolders.push({...folder, order: --folder.order});
        //         } else if (folder.depth === 2 && folder.parentOrder === targetFolder.parentOrder && folder.order >= targetFolder.order) {
        //             resultFolders.push({...folder, order: ++folder.order});x
        //         } else if (folder.depth === 2 && folder.parentOrder > moveFolder.order) {
        //             resultFolders.push({...folder, parentOrder: --folder.parentOrder});
        //         } else {
        //             resultFolders.push(folder);
        //         }
        //     } else if (moveFolder.depth === 1 && targetFolder.depth === 1) {
        //         if (folder.depth === 1 && folder.order > moveFolder.order && folder.order <= targetFolder.order) {
        //             resultFolders.push({...folder, order: --folder.order});
        //         } else if (folder.depth === 1 && folder.order < moveFolder.order && folder.order >= targetFolder.order) {
        //             resultFolders.push({...folder, order: ++folder.order});
        //         } else if (folder.depth === 2 && folder.parentOrder > moveFolder.order && folder.parentOrder <= targetFolder.order) {
        //             resultFolders.push({...folder, parentOrder: --folder.parentOrder});
        //         } else if (folder.depth === 2 && folder.parentOrder < moveFolder.order && folder.parentOrder >= targetFolder.order) {
        //             resultFolders.push({...folder, parentOrder: ++folder.parentOrder});
        //         } else {
        //             resultFolders.push(folder);
        //         }
        //     } else {
        //         resultFolders.push(folder);
        //     }
        // });
        //
        // setFolders(sortFolders([...resultFolders, ...moveFolders]));
    }

    const [openMoveModal, setOpenMoveModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<FolderResponse>({
        id: crypto.randomUUID(),
        title: "DigLog의 블로그",
        depth: 0,
        order: 0,
        parentOrder: -1,
    });
    const [editFolderId, setEditFolderId] = useState("");
    const [editFolderTitle, setEditFolderTitle] = useState("");
    const [targetFolder, setTargetFolder] = useState<FolderResponse>({
        id: crypto.randomUUID(),
        title: "DigLog의 블로그",
        depth: 0,
        order: 0,
        parentOrder: -1,
    });
    const [folderMoveType, setFolderMoveType] = useState(0);
    const folderMoveTypes = ["폴더 위로 옮깁니다.", "폴더 아래로 옮깁니다.", "폴더 내부로 옮깁니다."];

    const handleMoveFolder = () => {
        if (handleDisabled(folderMoveType)) {
            alert("활성화된 동작 중에서 선택해주세요.");
            return;
        }

        let moveTargetFolder;
        if (folderMoveType === 0) {
            moveTargetFolder = targetFolder;
        } else if (folderMoveType === 1) {
            moveTargetFolder = {...targetFolder, order: targetFolder.order + 1};
        } else {
            const maxOrder = folders.filter(folder => folder.depth === targetFolder.depth + 1 && folder.parentOrder === targetFolder.order)
                .reduce((max, f) => {
                    return f.order > max ? f.order : max;
                }, -1);
            moveTargetFolder = {
                ...targetFolder,
                depth: targetFolder.depth + 1,
                parentOrder: targetFolder.order,
                order: maxOrder + 1
            };
        }

        moveFolder(selectedFolder, moveTargetFolder);
        setOpenMoveModal(false);
    }

    const handleOnDragEnd = ({active, over}: DragEndEvent) => {
        if (!over || active.id === over.id) {
            return;
        }

        const activeFolder = folders.find(folder => folder.id === active.id);
        const overFolder = folders.find(folder => folder.id === over.id);

        if (!activeFolder || !overFolder) {
            return;
        }

        moveFolder(activeFolder, overFolder);
    }

    const handleDisabled = (moveType: number) => {
        if (!targetFolder) {
            return true;
        } else if (targetFolder.depth === 0 && moveType !== 2) {
            return true;
        } else if (targetFolder.depth == 2 && moveType == 2) {
            return true;
        } else if (moveType === 2 && selectedFolder.depth === 1 && targetFolder.depth !== 0 &&
            folders.findIndex(folder => folder.depth === 2 && folder.parentOrder === selectedFolder.order) !== -1) {
            return true;
        }
        return false;
    }

    const handleEdit = (editFolder: FolderResponse) => {
        if (editFolder.title.trim() === "") {
            alert("폴더 이름을 입력해주세요.");
            return;
        } else if (folders.findIndex(folder => folder.title === editFolderTitle.trim()) !== -1) {
            alert("중복된 폴더 이름입니다.");
            return;
        }

        setFolders(prevFolders =>
            prevFolders.map(folder =>
                folder.id === editFolder.id ? editFolder : folder));

        setEditFolderId("");
    }
    const handleDelete = (deleteFolder: FolderResponse) => {
        if (deleteFolder.depth === 1) {
            const findIndex = folders.findIndex(folder =>
                folder.depth === 2 && folder.parentOrder === deleteFolder.order);
            if (findIndex !== -1) {
                alert("하위 폴더를 삭제한 후에 삭제할 수 있습니다.");
                return;
            }
        }

        if (!confirm("삭제하시겠습니까?")) {
            return;
        }

        setFolders(sortFolders(folders.filter(folder => folder !== deleteFolder)));
    }

    const handleSubmit = () => {
        if (!confirm("변경사항을 적용하시겠습니까?")) {
            return;
        }
        alert("변경사항이 적용되었습니다.");
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

    return (
        <div>
            <p className="font-semibold text-xl my-4">폴더 관리</p>
            <DndContext onDragEnd={handleOnDragEnd}>
                <SortableContext items={folders} strategy={verticalListSortingStrategy}>
                    {folders.map((folder: FolderResponse) => (
                        <FolderCard
                            key={folder.id}
                            folder={folder}
                            editFolderId={editFolderId}
                            editFolderTitle={editFolderTitle}
                            setEditFolderId={setEditFolderId}
                            setEditFolderTitle={setEditFolderTitle}
                            handleEdit={handleEdit}
                            addFolder={addFolder}
                            handleDelete={handleDelete}
                            setOpenMoveModal={setOpenMoveModal}
                            setSelectedFolder={setSelectedFolder}/>
                    ))}
                </SortableContext>
            </DndContext>
            <button className="w-full border h-12 px-4 my-4 text-sm hover:cursor-pointer"
                    onClick={() => addFolder({
                        id: crypto.randomUUID(),
                        title: "",
                        depth: 0,
                        parentOrder: -1,
                        order: 0
                    }, `폴더_${crypto.randomUUID().substring(0, 4)}`)}>
                폴더 추가
            </button>
            <div className="flex justify-end">
                <FillButton text={"변경사항 저장"} onClick={handleSubmit} addStyle={"text-sm"}/>
                <FillButton text={"테스트 전송"} onClick={() => {

                    const folderRequestList: FolderRequest[] = [
                        {
                            id: crypto.randomUUID(),
                            name: faker.lorem.words(),
                            subFolders: [
                                {
                                    id: crypto.randomUUID(),
                                    name: faker.lorem.words(),
                                    subFolders: [],
                                },
                                {
                                    id: crypto.randomUUID(),
                                    name: faker.lorem.words(),
                                    subFolders: [],
                                },
                            ],
                        },
                        {
                            id: crypto.randomUUID(),
                            name: faker.lorem.words(),
                            subFolders: [
                                {
                                    id: crypto.randomUUID(),
                                    name: faker.lorem.words(),
                                    subFolders: [],
                                },
                                {
                                    id: crypto.randomUUID(),
                                    name: faker.lorem.words(),
                                    subFolders: [],
                                },
                            ],
                        },
                        {
                            id: crypto.randomUUID(),
                            name: faker.lorem.words(),
                            subFolders: [
                                {
                                    id: crypto.randomUUID(),
                                    name: faker.lorem.words(),
                                    subFolders: [],
                                },
                            ],
                        },
                    ]

                    testApi(folderRequestList)
                        .then((res) => console.log(res.data))
                        .catch((error) => console.log(error));
                }}/>
            </div>
            {openMoveModal && (
                <ModalLayout addStyle={"!w-128"} customRef={modalRef}>
                    <div className="w-full h-full">
                        <div className="flex flex-col justify-center items-center gap-y-8">
                            <p><span className="font-bold">{selectedFolder.title}</span> 폴더를</p>
                            <CategorySelectBox
                                folders={folders}
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