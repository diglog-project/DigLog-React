import {FillButton} from "../common/FillButton.tsx";
import {useState} from "react";
import {TextButton} from "../common/TextButton.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";
import ModalLayout from "../../layout/ModalLayout.tsx";
import {FolderType} from "../../common/types/blog.tsx";

function FolderMoveModal({selectedFolder, folders, handleFolderMove, setShowModal}: {
    selectedFolder: FolderType | null,
    folders: FolderType[],
    handleFolderMove: (folderId: string) => void
    setShowModal: (showModal: boolean) => void,
}) {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    const [selectedFolderId, setSelectedFolderId] = useState<string>("");

    const handleFolderChange = () => {
        handleFolderMove(selectedFolderId);

        setShowModal(false);
    }

    return (
        <ModalLayout>
            <div className="flex flex-col gap-y-4">
                <p className="font-bold mb-4">
                    "{selectedFolder?.title}" 폴더를 이동할 곳을 골라주세요.
                </p>
                <button
                    className={`${"top" === selectedFolderId && "bg-lime-300"} border border-gray-400 p-2 text-start hover:bg-lime-300 hover:cursor-pointer`}
                    onClick={() => setSelectedFolderId("top")}>
                    {loginState.username}의 블로그
                </button>
                {folders.map(folder => (
                    <button key={folder.id}
                            className={`${folder.id === selectedFolderId && "bg-lime-300"} ml-8 border border-gray-400 p-2 text-start hover:bg-lime-300 hover:cursor-pointer`}
                            onClick={() => setSelectedFolderId(folder.id)}>
                        {folder.title}
                    </button>
                ))}
                <div className="flex justify-between items-center">
                    <TextButton text={"취소"} onClick={() => setShowModal(false)}/>
                    <FillButton text={"이동"} onClick={handleFolderChange}/>
                </div>
            </div>
        </ModalLayout>
    );
}

export default FolderMoveModal;