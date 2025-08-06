import { FolderType } from "../../common/types/blog.tsx";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { getFolderTitle } from "../../common/util/string.tsx";

function FolderSelectBox({ folders, depth = 0, selectedFolder, targetFolder, setTargetFolder, center }: {
    folders: FolderType[],
    depth?: number,
    selectedFolder?: FolderType | null,
    targetFolder: FolderType | null,
    setTargetFolder: (folder: FolderType) => void,
    center?: boolean,
}) {

    const [folderOpen, setFolderOpen] = useState(false);
    const handleFolderOpen = () => {
        setFolderOpen(prev => !prev);
    }

    const folderRef = useRef<HTMLDivElement | null>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (folderRef.current && !folderRef.current.contains(event.target as Node)) {
            setFolderOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={folderRef}
            className={`w-full relative flex ${center ? "justify-center" : "justify-start"} text-gray-700 items-center my-2 text-sm font-normal`}>
            <button
                className="w-full flex justify-between items-center gap-x-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 hover:cursor-pointer"
                onClick={handleFolderOpen}>
                {targetFolder ? targetFolder.title : "폴더 선택"}
                <MdOutlineArrowDropDown />
            </button>
            <div
                className={`${folderOpen ? "" : "hidden"} h-72 min-h-16 overflow-y-scroll absolute z-50 w-full top-12 left-0 bg-white divide-y divide-gray-300 rounded-lg shadow-sm`}>
                {folders.map((folder) =>
                    <FolderSelectCard
                        key={folder.id}
                        folder={folder}
                        depth={depth}
                        selectedFolder={selectedFolder}
                        setTargetFolder={setTargetFolder}
                        setFolderOpen={setFolderOpen} />
                )}
            </div>
        </div>
    );
}

function FolderSelectCard({ folder, depth, selectedFolder, setTargetFolder, setFolderOpen }: {
    folder: FolderType,
    depth: number,
    selectedFolder?: FolderType | null,
    setTargetFolder: (folder: FolderType) => void,
    setFolderOpen: (open: boolean) => void,
}) {

    return !selectedFolder || folder.id !== selectedFolder.id ? (
        <div key={folder.title} className={`text-sm`}>
            <button
                className={`px-4 py-2 text-gray-700 w-full text-start hover:bg-gray-100 hover:cursor-pointer`}
                onClick={() => {
                    setTargetFolder(folder);
                    setFolderOpen(false);
                }}>
                <div className={`flex items-center gap-x-1 ${depth === 0 && "font-bold text-black"}`}>
                    <div className={`w-${depth * 4}`} />
                    {getFolderTitle(folder.title, depth)}
                    {folder.id !== "empty" && <p className="text-xs font-light">({folder.postCount})</p>}
                </div>
            </button>
            {folder.subFolders &&
                folder.subFolders.map((subFolder =>
                    <FolderSelectCard
                        key={subFolder.id}
                        folder={subFolder}
                        selectedFolder={selectedFolder}
                        depth={depth + 1}
                        setTargetFolder={setTargetFolder}
                        setFolderOpen={setFolderOpen} />))}
        </div>
    ) : <></>;
}

export default FolderSelectBox;