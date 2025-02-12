import ModalLayout from "../../layout/ModalLayout.tsx";
import {useState} from "react";
import {FillButton} from "../common/FillButton.tsx";
import {FolderType} from "../../pages/setting/SettingPage.tsx";
import {TextButton} from "../common/TextButton.tsx";
import {MdOutlineArrowDropDown} from "react-icons/md";

function FolderAddModal({folders, setShowFolderAddModal}: {
    folders: FolderType[],
    setShowFolderAddModal: (modal: boolean) => void
}) {

    const [inputFolder, setInputFolder] = useState("");
    const [folderOpen, setFolderOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState("블로그");

    return (
        <ModalLayout>
            <div className="flex flex-col gap-y-4">
                <p>폴더 추가</p>
                <button
                    className="w-auto flex justify-between items-center gap-x-2 px-3 py-2 border border-gray-200 hover:bg-gray-50 hover:cursor-pointer"
                    onClick={() => setFolderOpen(prev => !prev)}>
                    {selectedFolder}
                    <MdOutlineArrowDropDown/>
                </button>
                <div
                    className={`${folderOpen ? "" : "hidden"} absolute z-50 top-12 left-0 bg-white divide-y divide-gray-500 rounded-lg shadow-sm`}>
                    <div className="py-2 w-auto text-sm">
                        <button
                            className="px-4 py-2 text-gray-700 text-start hover:bg-gray-100 w-full hover:cursor-pointer"
                            onClick={() => {
                                setSelectedFolder("블로그");
                                setFolderOpen(false);
                            }}>
                            블로그
                        </button>
                    </div>
                    {folders.map((folder) => {
                        if (!folder.subFolders) {
                            return <div key={folder.name} className="py-2 w-auto text-sm">
                                <button
                                    className="px-4 py-2 text-gray-700 text-start hover:bg-gray-100 w-full hover:cursor-pointer"
                                    onClick={() => {
                                        setSelectedFolder(folder.name);
                                        setFolderOpen(false);
                                    }}>
                                    {folder.name}
                                </button>
                            </div>
                        } else {
                            return <div key={folder.name}
                                        className="flex flex-col items-start py-2 w-auto text-sm">
                                <button
                                    className="px-4 py-2 text-gray-700 text-start border-gray-200 hover:bg-gray-100 w-full hover:cursor-pointer"
                                    onClick={() => {
                                        setSelectedFolder(folder.name);
                                        setFolderOpen(false);
                                    }}>
                                    {folder.name}
                                </button>
                                {folder.subFolders.map((subFolder: FolderType) =>
                                    <button
                                        key={subFolder.name}
                                        className="px-4 py-2 text-gray-700 text-start hover:bg-gray-100 w-full hover:cursor-pointer"
                                        onClick={() => {
                                            setSelectedFolder(`${folder.name} > ${subFolder.name}`);
                                            setFolderOpen(false);
                                        }}>
                                        {`${folder.name} > ${subFolder.name}`}
                                    </button>
                                )}
                            </div>;
                        }
                    })}
                </div>
                <input type="text"
                       value={inputFolder}
                       onChange={(e) => setInputFolder(e.target.value)}
                       placeholder="폴더 이름을 입력해주세요."
                       className="border border-gray-400 p-4 font-bold"/>
                <div className="flex justify-between items-center">
                    <TextButton text={"취소"} onClick={() => setShowFolderAddModal(false)}/>
                    <FillButton text={"폴더 추가"} onClick={() => {
                        alert("폴더가 추가되었습니다.");
                        setShowFolderAddModal(false);
                    }}/>
                </div>
            </div>
        </ModalLayout>
    );
}

export default FolderAddModal;