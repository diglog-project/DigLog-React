import {FolderType} from "../../common/types/blog.tsx";
import {MdOutlineArrowDropDown} from "react-icons/md";
import {useEffect, useRef, useState} from "react";

function CategorySelectBox({folders, depth, selectedFolder, targetFolder, setTargetFolder, center}: {
    folders: FolderType[],
    depth: number,
    selectedFolder: FolderType,
    targetFolder: FolderType,
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
                {targetFolder.title}
                <MdOutlineArrowDropDown/>
            </button>
            <div
                className={`${folderOpen ? "" : "hidden"} absolute z-50 w-full top-12 left-0 bg-white divide-y divide-gray-300 rounded-lg shadow-sm`}>
                {folders.map((folder) =>
                    <CategorySelectCard
                        folder={folder}
                        depth={depth}
                        selectedFolder={selectedFolder}
                        setTargetFolder={setTargetFolder}
                        setFolderOpen={setFolderOpen}/>
                )}
            </div>
        </div>
    );
}

function CategorySelectCard({folder, depth, selectedFolder, setTargetFolder, setFolderOpen}: {
    folder: FolderType,
    depth: number,
    selectedFolder: FolderType,
    setTargetFolder: (folder: FolderType) => void,
    setFolderOpen: (open: boolean) => void,
}) {
    return folder.id !== selectedFolder.id ? (
        <div key={folder.title} className={`text-sm`}>
            <button
                className={`px-4 py-2 text-gray-700 w-full text-start hover:bg-gray-100 hover:cursor-pointer`}
                onClick={() => {
                    setTargetFolder(folder);
                    setFolderOpen(false);
                }}>
                <p className={`ml-${depth * 4}`}>{folder.title}</p>
            </button>
            {folder.subFolders.length > 0 &&
                folder.subFolders.map((subFolder =>
                    <CategorySelectCard
                        folder={subFolder}
                        selectedFolder={selectedFolder}
                        depth={depth + 1}
                        setTargetFolder={setTargetFolder}
                        setFolderOpen={setFolderOpen}/>))}
        </div>
    ) : <></>;
}

export default CategorySelectBox;