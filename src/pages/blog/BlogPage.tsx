import BasicLayout from "../../layout/BasicLayout.tsx";
import {useParams, useSearchParams} from "react-router-dom";
import {faker} from "@faker-js/faker/locale/ko";
import PostCard from "../../components/post/PostCard.tsx";
import TagCard from "../../components/post/TagCard.tsx";
import {useEffect, useRef, useState} from "react";
import {MdMenu, MdOutlineExitToApp} from "react-icons/md";
import PaginationButton from "../../components/common/PaginationButton.tsx";
import TagChip from "../../components/post/TagChip.tsx";
import {OutlineLink} from "../../components/common/OutlineButton.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";

function BlogPage() {

    const {username} = useParams();

    const [searchParams, setSearchParams] = useSearchParams({"folder": ""});

    const [isOpen, setIsOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(searchParams.get("folder") || "");
    const [selectedTagList, setSelectedTagList] = useState<string[]>([]);

    const mainRef = useRef<HTMLDivElement | null>(null);
    const sideBarRef = useRef<HTMLDivElement | null>(null);

    const handleMenuOpen = () => {
        setIsOpen(cur => !cur);
    }
    const handleClickOutside = (event: MouseEvent) => {
        if (sideBarRef.current && !sideBarRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const addTag = (selectTag: string) => {
        setSelectedTagList([...selectedTagList, selectTag]);
    }

    const removeTag = (selectTag: string) => {
        setSelectedTagList(prevState => prevState.filter(tag => tag !== selectTag));
    }

    const removeFolder = (selectFolder: string) => {
        console.log(selectFolder);
        setSelectedFolder("");
    }

    useEffect(() => {
        if (sideBarRef.current && mainRef.current) {
            sideBarRef.current.style.height = `${mainRef.current.offsetHeight + 220}px`;
        }
    }, []);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.title = username || "DIGLOG";

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.title = "DIGLOG";
        };
    }, []);

    useEffect(() => {
        setSearchParams({
            "folder": selectedFolder
        })
    }, [selectedFolder]);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.remove('overflow-x-hidden');
        } else {
            document.body.classList.add('overflow-x-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-x-hidden');
        };
    }, [isOpen]);

    return (
        <BasicLayout>
            <div ref={mainRef}
                 className={`${(isOpen) ? "opacity-50 backdrop-blur-sm z-10" : "z-10"} flex flex-col`}>
                <div className="flex justify-between items-center text-2xl font-jalnan px-4">
                    <div>{username}의 블로그</div>
                    <button onClick={handleMenuOpen} className="lg:hidden hover:cursor-pointer">
                        <MdMenu className="size-8"/>
                    </button>
                </div>
                <div className="flex flex-col flex-wrap gap-4 justify-center items-start px-4 py-4">
                    <div className="flex flex-wrap justify-start items-center gap-x-4">
                        폴더 {selectedFolder !== "" && <TagChip name={selectedFolder} removeTag={removeFolder}/>}
                    </div>
                    <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-2">
                        태그 {selectedTagList.map((tag) => <TagChip name={tag} removeTag={removeTag}/>)}
                    </div>
                </div>
                <div className="grid lg:grid-cols-3">
                    <div className="lg:col-span-2 flex flex-col gap-y-4 p-4 md:border-r border-r-gray-200">
                        {[Array.from({length: 3}).map(() => (
                            <PostCard
                                key={faker.number.int().toString()}
                                id={faker.number.int().toString()}
                                title={faker.lorem.sentence()}
                                content={`${faker.lorem.paragraphs()}<img src=${faker.image.url({
                                    width: 320,
                                    height: 320
                                })}/>`}
                                username={username || faker.animal.cat()}
                                tags={[{
                                    id: faker.number.int().toString(),
                                    name: faker.word.sample()
                                }, {id: faker.number.int().toString(), name: faker.word.sample()}]}
                                createdAt={new Date()}/>
                        ))]}
                        <PaginationButton
                            pageInfo={{size: 5, number: 0, totalPages: 25, totalElements: 120}} setPage={() => {
                        }}/>
                    </div>
                    <div className="col-span-1 hidden lg:block flex-col">
                        <SideBar
                            username={username}
                            addTag={addTag}
                            setSelectedFolder={setSelectedFolder}/>
                    </div>
                </div>
            </div>
            <div ref={sideBarRef}
                 className={`${isOpen ? "translate-x-0 overflow-y-scroll" : "translate-x-full overflow-y-hidden"} absolute top-0 right-0 w-96 flex-col
                     transform transition-transform duration-300 ease-out z-20`}>
                <button className="absolute top-4 right-[calc(320px)] hover:cursor-pointer"
                        onClick={() => setIsOpen(false)}>
                    <MdOutlineExitToApp className="size-8 text-gray-500"/>
                </button>
                <SideBar
                    username={username}
                    addTag={addTag}
                    setSelectedFolder={setSelectedFolder}
                    bgColor={"bg-gray-50"}/>
            </div>
        </BasicLayout>
    );
}

function SideBar({username, addTag, setSelectedFolder, bgColor}: {
    username: string | undefined,
    addTag: (tagName: string) => void,
    setSelectedFolder: (folder: string) => void,
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
                        <OutlineLink text={"블로그 설정"} to={"/write"}
                                     addStyle={"!border-neutral-500 !text-neutral-500 hover:bg-neutral-500 hover:!text-white"}/>
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center gap-4 py-8">
                <div className="font-bold text-center">폴더</div>
                <div className="flex flex-col gap-y-4 p-2">
                    {[Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="flex flex-col gap-y-2 font-semibold">
                            <button className="flex justify-start items-center hover:cursor-pointer"
                                    onClick={() => setSelectedFolder(faker.word.words())}>
                                {faker.word.words()}
                            </button>
                            <div
                                className="flex flex-col gap-y-1 font-normal text-gray-400 border-l border-gray-300 pl-2">
                                {Array.from({length: 3}).map((_, i) => (
                                    <button key={i} className="flex justify-start hover:cursor-pointer"
                                            onClick={() => setSelectedFolder(`${faker.word.words()} > ${faker.word.words()}`)}>
                                        {faker.word.words()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))]}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 py-8">
                <div className="font-bold text-center">태그</div>
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 p-2">
                    {[Array.from({length: 24}).map(() => (
                        <TagCard key={faker.number.int().toString()}
                                 tag={{
                                     id: faker.number.int().toString(),
                                     name: faker.word.sample()
                                 }}
                                 onClick={addTag}/>
                    ))]}
                </div>
            </div>
        </div>
    );
}

export default BlogPage;