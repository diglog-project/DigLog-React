import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {SortableContext} from "@dnd-kit/sortable";
import {FillButton} from "../../components/common/FillButton.tsx";
import {FolderType} from "./SettingPage.tsx";
import FolderCard from "../../components/setting/FolderCard.tsx";
import {OutlineButton} from "../../components/common/OutlineButton.tsx";

function OldFolderSettingPage({
                               setSelectedFolder,
                               folders,
                               setShowModal,
                               setShowFolderAddModal,
                               handleDragEnd,
                               isHover,
                               handleHover,
                               submitFolderChange
                           }: {
    setSelectedFolder: (folder: FolderType) => void,
    folders: FolderType[],
    setShowModal: (modal: boolean) => void,
    setShowFolderAddModal: (modal: boolean) => void,
    handleDragEnd: (event: DragEndEvent) => void,
    isHover: boolean,
    handleHover: (hover: boolean) => void,
    submitFolderChange: () => void,
}) {

    return (
        <div>
            <p className="font-semibold text-xl my-4">폴더 관리</p>
            <div className="flex flex-col w-full">
                <DndContext modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}>
                    <SortableContext items={folders}>
                        {folders.map((folder) => (
                            <div key={folder.id}>
                                <FolderCard
                                    setSelectedFolder={setSelectedFolder}
                                    folder={folder}
                                    setShowModal={setShowModal}
                                    handleDrag={handleDragEnd}
                                    isHover={isHover}
                                    handleHover={handleHover}/>
                            </div>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
            <div className="flex justify-end w-full my-4 gap-x-4">
                <OutlineButton text={"폴더 추가"} onClick={() => setShowFolderAddModal(true)} addStyle={"font-normal"}/>
                <FillButton text={"변경사항 저장"} onClick={submitFolderChange} addStyle={"font-normal"}/>
            </div>
        </div>
    );
}

export default OldFolderSettingPage;