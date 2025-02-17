import {FolderType} from "../../common/types/blog.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";
import {faker} from "@faker-js/faker/locale/ko";
import {OutlineLink} from "../common/OutlineButton.tsx";
import BlogTagCard from "./BlogTagCard.tsx";

function BlogSideBar({folders, username, addTag, setSelectedFolder, bgColor}: {
    folders: FolderType[],
    username: string | undefined,
    addTag: (tagName: string) => void,
    setSelectedFolder: (folder: FolderType) => void,
    bgColor?: string
}) {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    return (
        <div className={bgColor}>
            <div className="flex flex-col justify-start items-center py-4 gap-4 z-200">
                <img className="border border-gray-300 h-32 w-32 rounded-full"
                     src={faker.image.avatar()} alt="username"/>
                <div className="flex justify-center items-center text-2xl font-black">
                    {username}
                </div>
                {username === loginState.username && (
                    <div className="flex justify-between items-center gap-x-4 text-xs">
                        <OutlineLink text={"게시글 작성"} to={"/write"}/>
                        <OutlineLink text={"블로그 설정"} to={"/setting"}
                                     addStyle={"!border-neutral-500 !text-neutral-500 hover:bg-neutral-500 hover:!text-white"}/>
                    </div>
                )}
            </div>
            <div className="w-72 mx-auto flex flex-col justify-center items-start gap-4 py-8">
                <div className="w-full font-bold text-lime-700 text-center">폴더</div>
                <BlogFolderList
                    folders={folders}
                    setSelectedFolder={setSelectedFolder}/>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 py-8">
                <div className="font-bold text-lime-700 text-center">태그</div>
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 p-2">
                    {[Array.from({length: 24}).map(() => (
                        <BlogTagCard key={faker.number.int().toString()}
                                     tag={{
                                         id: faker.number.int().toString(),
                                         name: faker.word.sample()
                                     }}
                                     addTag={addTag}/>
                    ))]}
                </div>
            </div>
        </div>
    );
}

function BlogFolderList({depth = 0, folders, setSelectedFolder}: {
    depth?: number,
    folders: FolderType[],
    setSelectedFolder: (folder: FolderType) => void,
}) {

    return (
        <div className="w-full flex flex-col gap-y-1">
            {folders.map(folder =>
                <div key={folder.id} className={`flex flex-col gap-y-2`}>
                    {depth === 0 && <div className="h-2"/>}
                    <button
                        className={`flex justify-start items-center hover:opacity-50 hover:cursor-pointer 
                        ${depth === 0 && "font-bold"}
                        ${depth > 0 && `text-gray-500`}`}
                        onClick={() => setSelectedFolder(folder)}>
                        {depth === 2 && <div className="w-8"/>}
                        - {folder.title}
                    </button>
                    {depth === 0 && <hr className="text-gray-400"/>}
                    <BlogFolderList
                        depth={depth + 1}
                        folders={folder.subFolders}
                        setSelectedFolder={setSelectedFolder}/>
                </div>)}
        </div>
    );
}

export default BlogSideBar;