import BasicLayout from "../../layout/BasicLayout.tsx";
import {useState} from "react";
import {faker} from "@faker-js/faker/locale/ko";
import {DragEndEvent} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import {useNavigate} from "react-router-dom";
import OldFolderSettingPage from "./OldFolderSettingPage.tsx";
import PostSettingPage from "./PostSettingPage.tsx";
import ProfileSettingPage from "./ProfileSettingPage.tsx";
import FolderMoveModal from "../../components/setting/FolderMoveModal.tsx";
import FolderAddModal from "../../components/setting/FolderAddModal.tsx";
import FolderSettingPage from "./FolderSettingPage.tsx";

export interface FolderType {
    id: string;
    name: string;
    subFolders?: FolderType[];
}

function SettingPage() {

    const navigate = useNavigate();

    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showFolderAddModal, setShowFolderAddModal] = useState(false);

    const tabList = ["프로필", "폴더", "폴더2", "게시글"];
    const folderData: FolderType[] = [
        {
            id: "1",
            name: faker.lorem.words(),
            subFolders: [
                {id: "4", name: faker.lorem.words()},
                {id: "5", name: faker.lorem.words()}
            ]
        },
        {
            id: "2",
            name: faker.lorem.words(),
        },
        {
            id: "3",
            name: faker.lorem.words(),
            subFolders: [
                {id: "6", name: faker.lorem.words()},
                {id: "7", name: faker.lorem.words()},
                {id: "8", name: faker.lorem.words()}
            ]
        },
    ];

    const [selectedTab, setSelectedTab] = useState("폴더2");
    const [folders, setFolders] = useState<FolderType[]>(folderData);
    const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
    const [isHover, setIsHover] = useState(false);

    const handleHover = (hover: boolean) => {
        setIsHover(hover);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over || active.id === over.id) {
            return;
        }

        let folderIndex = -1;
        let oldIndex = -1;
        let newIndex = -1;

        oldIndex = folders.findIndex(folder => folder.id === active.id);
        newIndex = folders.findIndex(folder => folder.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            setFolders(folder => {
                return arrayMove(folder, oldIndex, newIndex);
            });
            return;
        }

        for (const folder of folders) {
            if (folder.subFolders) {
                oldIndex = folder.subFolders.findIndex(folder => folder.id === active.id);
                newIndex = folder.subFolders.findIndex(folder => folder.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    folderIndex = folders.indexOf(folder);
                    break;
                }
            }
        }

        if (folderIndex !== -1 && oldIndex !== -1 && newIndex !== -1) {
            setFolders(currentFolders => {
                const updatedSubFolders = [...currentFolders[folderIndex].subFolders!];
                const [movedFolder] = updatedSubFolders.splice(oldIndex, 1);
                updatedSubFolders.splice(newIndex, 0, movedFolder);

                const updatedFolders = [...currentFolders];
                updatedFolders[folderIndex] = {
                    ...updatedFolders[folderIndex],
                    subFolders: updatedSubFolders
                };

                return updatedFolders;
            });
        }
    }

    const handleFolderMove = (folderId: string) => {
        setFolders(prevFolders => {
            const newFolders = [...prevFolders];
            let folderToMove;
            let targetFolder: FolderType | undefined;

            newFolders.forEach(folder => {
                if (folder.subFolders) {
                    const subFolderIndex = folder.subFolders.findIndex(sub => sub.id === selectedFolder?.id);
                    if (subFolderIndex !== -1) {
                        folderToMove = folder.subFolders[subFolderIndex];
                        folder.subFolders.splice(subFolderIndex, 1);
                    }
                }

                if (folder.id === folderId) {
                    targetFolder = folder;
                }
            });

            if (!folderToMove) {
                return prevFolders;
            }

            if (folderId === "top") {
                newFolders.push(folderToMove);
                return newFolders;
            }

            if (!targetFolder) {
                return prevFolders;
            }

            if (!targetFolder.subFolders) {
                targetFolder.subFolders = [];
            }

            targetFolder.subFolders.push(folderToMove);

            return newFolders;
        });
    }

    const submitFolderChange = () => {
        if (confirm("변경사항을 저장하시겠습니까?")) {
            alert("저장되었습니다.");
            navigate(0);
        }
    }

    return (
        <BasicLayout>
            <div className="flex w-full gap-x-4">
                <div
                    className="w-52 h-full flex flex-col justify-start items-start">
                    <ul className="w-full flex flex-col gap-y-1.5 flex-wrap">
                        {tabList.map((tab) =>
                            <li key={tab}>
                                <button
                                    onClick={() => setSelectedTab(tab)}
                                    className="text-left w-full p-2 my-1 hover:bg-gray-200 hover:cursor-pointer">
                                    {tab}
                                </button>
                            </li>)}
                    </ul>
                </div>
                {(selectedTab === "폴더") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <OldFolderSettingPage
                            setSelectedFolder={setSelectedFolder}
                            folders={folders}
                            setShowModal={setShowFolderModal}
                            setShowFolderAddModal={setShowFolderAddModal}
                            handleDragEnd={handleDragEnd}
                            isHover={isHover}
                            handleHover={handleHover}
                            submitFolderChange={submitFolderChange}/>
                    </div>}
                {(selectedTab === "폴더2") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <FolderSettingPage/>
                    </div>}
                {(selectedTab === "게시글") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <PostSettingPage/>
                    </div>}
                {(selectedTab === "프로필") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <ProfileSettingPage/>
                    </div>}
            </div>
            {showFolderModal && <FolderMoveModal
                selectedFolder={selectedFolder}
                folders={folders}
                handleFolderMove={handleFolderMove}
                setShowModal={setShowFolderModal}/>}
            {showFolderAddModal && <FolderAddModal
                folders={folders}
                setShowFolderAddModal={setShowFolderAddModal}/>}
        </BasicLayout>
    );
}

export default SettingPage;