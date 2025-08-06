import { FolderType } from "../../common/types/blog.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store.tsx";
import { OutlineLink } from "../common/OutlineButton.tsx";
import BlogTagCard from "./BlogTagCard.tsx";
import { getFolderTitle } from "../../common/util/string.tsx";
import ProfileImageCircle from "../common/ProfileImageCircle.tsx";
import { TagResponse } from "../../common/types/post.tsx";

function BlogSideBar({ folders, tags, username, profileUrl, selectedFolder, setSelectedFolder, bgColor, side }: {
    folders: FolderType[],
    tags: TagResponse[],
    username: string | undefined,
    profileUrl: string | null,
    selectedFolder: FolderType | null,
    setSelectedFolder: (folder: FolderType) => void,
    bgColor?: string,
    side?: boolean,
}) {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    return (
        <div className={`${bgColor} ${side && "h-screen overflow-y-scroll"}`}>
            <div className="flex flex-col justify-start items-center py-4 gap-4 z-200">
                <ProfileImageCircle profileUrl={profileUrl} size="md" />
                <div className="flex justify-center items-center text-xl font-black">
                    {username}
                </div>
                {username === loginState.username && (
                    <div className="flex justify-between items-center gap-x-4 my-2 text-xs">
                        <OutlineLink text={"게시글 작성"} to={"/write"} />
                        <OutlineLink text={"블로그 설정"} to={"/setting/folder"}
                            addStyle={"!border-neutral-500 !text-neutral-500 hover:bg-neutral-500 hover:!text-white"} />
                    </div>
                )}
            </div>
            <div className="w-72 mx-auto flex flex-col justify-center items-start gap-4 py-8">
                <div className="w-full font-bold text-lime-700 text-center">폴더</div>
                <BlogFolderList
                    folders={folders}
                    selectedFolder={selectedFolder}
                    setSelectedFolder={setSelectedFolder} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 py-8">
                <div className="font-bold text-lime-700 text-center">태그</div>
                <div className="w-72 flex flex-wrap justify-center gap-x-2 gap-y-4">
                    {tags.map((tag) => (
                        <BlogTagCard
                            key={tag.id}
                            tag={tag}
                            username={username || ""} />
                    ))}
                    {tags.length === 0 &&
                        <div className="text-center text-gray-600">
                            생성된 태그가 없습니다.
                        </div>}
                </div>
            </div>
        </div>
    );
}

function BlogFolderList({ depth = 0, folders, selectedFolder, setSelectedFolder }: {
    depth?: number,
    folders: FolderType[],
    selectedFolder: FolderType | null,
    setSelectedFolder: (folder: FolderType) => void,
}) {

    const getPostCount = (folder: FolderType) => {
        let resultCount = folder.postCount;

        if (folder.subFolders) {
            folder.subFolders.forEach(subFolder => {
                resultCount += getPostCount(subFolder);
            })
        }

        return resultCount;
    }

    return (
        <div className="w-full flex flex-col gap-y-1">
            {folders.length > 1 && folders.map(folder =>
                <div key={folder.id} className={`flex flex-col gap-y-2`}>
                    {depth === 0 && <div className="h-2" />}
                    <button
                        className={`flex justify-start items-center hover:opacity-50 hover:cursor-pointer gap-x-2
                        ${depth === 0 && "font-bold"}
                        ${depth > 0 && "text-gray-500"}
                        ${selectedFolder?.id === folder.id && "!text-lime-600"}
                        ${!selectedFolder && folder.id === "" && "!text-lime-600"}`}
                        onClick={() => setSelectedFolder(folder)}>
                        {depth === 2 && <div className="w-8" />}
                        {getFolderTitle(folder.title, depth)}
                        {folder.id !== "" && <p className="text-xs font-light">({getPostCount(folder)})</p>}
                    </button>
                    {folder.subFolders.length > 0 && depth === 0 && <hr className="text-gray-400" />}
                    <BlogFolderList
                        depth={depth + 1}
                        folders={folder.subFolders}
                        selectedFolder={selectedFolder}
                        setSelectedFolder={setSelectedFolder} />
                </div>)}
            {depth === 0 && folders.length <= 1 &&
                <div className="text-center text-gray-600">
                    생성된 폴더가 없습니다.
                </div>}
        </div>
    );
}

export default BlogSideBar;