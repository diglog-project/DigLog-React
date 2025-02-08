import BasicLayout from "../../layout/BasicLayout.tsx";
import {useState} from "react";
import {faker} from "@faker-js/faker/locale/ko";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable} from "@dnd-kit/sortable";
import {MdOutlineMenu} from "react-icons/md";
import {CSS} from "@dnd-kit/utilities";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {FillButton} from "../../components/common/FillButton.tsx";
import {useNavigate} from "react-router-dom";
import {TextButton} from "../../components/common/TextButton.tsx";

function BlogSettingPage() {

    const [selectedTab, setSelectedTab] = useState("카테고리");
    const tabList = ["카테고리", "게시글"];

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
                <BlogSettingMain selectedTab={selectedTab}/>
            </div>
        </BasicLayout>
    );
}

interface FolderType {
    id: string;
    name: string;
    subFolder?: FolderType[];
}

function BlogSettingMain({selectedTab}: { selectedTab: string }) {

    const navigate = useNavigate();

    const folderData: FolderType[] = [
        {
            id: "1",
            name: faker.lorem.words(),
            subFolder: [
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
            subFolder: [
                {id: "6", name: faker.lorem.words()},
                {id: "7", name: faker.lorem.words()},
                {id: "8", name: faker.lorem.words()}
            ]
        },
    ];

    const [folders, setFolders] = useState<FolderType[]>(folderData);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over || active.id === over.id) {
            return;
        }

        setFolders(folder => {
            const oldIndex = folders.findIndex(folder => folder.id === active.id);
            const newIndex = folders.findIndex(folder => folder.id === over.id);

            return arrayMove(folder, oldIndex, newIndex);
        });
    }

    const handleDragEndSubFolder = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over || active.id === over.id) {
            return;
        }

        let folderIndex = -1;
        let oldIndex = -1;
        let newIndex = -1;

        for (const folder of folders) {
            if (folder.subFolder) {
                oldIndex = folder.subFolder.findIndex(folder => folder.id === active.id);
                newIndex = folder.subFolder.findIndex(folder => folder.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    folderIndex = folders.indexOf(folder);
                    break;
                }
            }
        }

        if (folderIndex !== -1 && oldIndex !== -1 && newIndex !== -1) {
            setFolders(currentFolders => {
                const updatedSubFolders = [...currentFolders[folderIndex].subFolder!];
                const [movedFolder] = updatedSubFolders.splice(oldIndex, 1);
                updatedSubFolders.splice(newIndex, 0, movedFolder);

                const updatedFolders = [...currentFolders];
                updatedFolders[folderIndex] = {...updatedFolders[folderIndex], subFolder: updatedSubFolders};

                return updatedFolders;
            });
        }
    }

    const submitFolderChange = () => {
        if (confirm("변경사항을 저장하시겠습니까?")) {
            alert("저장되었습니다.");
            navigate(0);
        }
    }

    if (selectedTab === "카테고리") {
        return (
            <div className="border-l border-gray-200 w-full ps-8">
                <div>
                    <p className="font-semibold text-xl my-4">카테고리 관리</p>
                    <div className="flex flex-col w-full">
                        <DndContext modifiers={[restrictToVerticalAxis]}
                                    onDragEnd={handleDragEnd}>
                            <SortableContext items={folders}>
                                {folders.map((folder) => (
                                    <FolderCard key={folder.id} folder={folder} handleDrag={handleDragEndSubFolder}/>))}
                            </SortableContext>
                        </DndContext>
                    </div>
                    <div className="flex justify-between w-full my-4">
                        <div></div>
                        <FillButton text={"변경사항 저장"} onClick={submitFolderChange} addStyle={"font-normal"}/>
                    </div>
                </div>
            </div>
        );
    } else if (selectedTab === "게시글") {
        return (
            <div className="w-full">
                <div className="">
                    게시글
                </div>
            </div>
        );
    }

    return <></>;
}

function FolderCard({folder, handleDrag}: { folder: FolderType, handleDrag: (event: DragEndEvent) => void }) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: folder.id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}
             className="flex flex-col w-full border border-gray-200 font-bold gap-x-2 p-4 my-1">
            <div className="flex justify-between items-center gap-x-4">
                <button {...attributes} {...listeners}
                     className="hover:cursor-pointer">
                    <MdOutlineMenu className="size-6"/>
                </button>
                <p className="flex-1">{folder.name}</p>
            </div>
            {(folder.subFolder) &&
                <DndContext modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDrag}>
                    <SortableContext items={folder.subFolder}>
                        {folder.subFolder.map((subFolder) => (
                            <SubFolderCard key={subFolder.id} subFolder={subFolder}/>
                        ))}
                    </SortableContext>
                </DndContext>}
        </div>
    );
}

function SubFolderCard({subFolder}: { subFolder: FolderType }) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: subFolder.id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} className="ml-10 mt-4 border border-gray-200 flex flex-col p-2 my-2" style={style}>
            <div>
                <div className="flex justify-between items-center gap-x-4">
                    <div {...attributes} {...listeners}
                         className="hover:cursor-pointer">
                        <MdOutlineMenu className="size-6"/>
                    </div>
                    <p className="flex-1">{subFolder.name}</p>
                </div>
            </div>
        </div>
    );
}

export default BlogSettingPage;