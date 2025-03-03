import BasicLayout from "../../layout/BasicLayout.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {faker} from "@faker-js/faker/locale/ko";
import PostCard from "../../components/post/PostCard.tsx";
import {useEffect, useRef, useState} from "react";
import {MdMenu, MdOutlineExitToApp} from "react-icons/md";
import PaginationButton from "../../components/common/PaginationButton.tsx";
import {FolderType} from "../../common/types/blog.tsx";
import BlogSideBar from "../../components/blog/BlogSideBar.tsx";
import IconButton from "../../components/common/IconButton.tsx";
import {PageResponse} from "../../common/types/common.tsx";
import {getMemberPosts} from "../../common/apis/blog.tsx";
import {PostResponse} from "../../common/types/post.tsx";
import {MemberProfileResponse} from "../../common/types/member.tsx";
import {getProfileByUsername} from "../../common/apis/member.tsx";

function BlogPage() {

    const navigate = useNavigate();
    const {username} = useParams();

    const [page, setPage] = useState(0);
    const [pageInfo, setPageInfo] = useState<PageResponse>({
        number: 0,
        size: 3,
        totalElements: 0,
        totalPages: 0
    });
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [member, setMember] = useState<MemberProfileResponse>({username: username || "", profileUrl: null});
    const folderData: FolderType[] = [
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            subFolders: [
                {
                    id: crypto.randomUUID(),
                    title: faker.lorem.words(),
                    subFolders: [
                        {
                            id: crypto.randomUUID(),
                            title: faker.lorem.words(),
                            subFolders: [],
                        },
                    ],
                },
                {
                    id: crypto.randomUUID(),
                    title: faker.lorem.words(),
                    subFolders: [],
                },
                {
                    id: crypto.randomUUID(),
                    title: faker.lorem.words(),
                    subFolders: [],
                },
                {
                    id: crypto.randomUUID(),
                    title: faker.lorem.words(),
                    subFolders: [],
                },
            ]
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            subFolders: [
                {
                    id: crypto.randomUUID(),
                    title: faker.lorem.words(),
                    subFolders: [],
                },
            ],
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            subFolders: [
                {
                    id: crypto.randomUUID(),
                    title: faker.lorem.words(),
                    subFolders: [],
                },
                {
                    id: crypto.randomUUID(),
                    title: faker.lorem.words(),
                    subFolders: [],
                },
                {
                    id: crypto.randomUUID(),
                    title: faker.lorem.words(),
                    subFolders: [],
                },
            ]
        },
    ];
    const [folders, setFolders] = useState<FolderType[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
    const [selectedTagList, setSelectedTagList] = useState<string[]>([]);

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

    useEffect(() => {
        // todo: 내 게시글 불러오기 api
        console.log(page, setPageInfo.toString());
        setFolders(folderData);
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
        navigate(`/blog/${username}?folder=${selectedFolder?.id || ""}`);
    }, [selectedFolder]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        if (username === undefined) {
            return;
        }

        getProfileByUsername(username)
            .then((res) => {
                setMember(res.data);
            })
            .catch(error => alert(error.response.data.message));

        getMemberPosts({
            username: username,
            folderId: null,
            page: page,
            size: pageInfo.size,
        })
            .then((res) => {
                setPosts(res.data.content);
                setPageInfo(res.data.page);
            })
            .catch(error => error.response.data.message);
    }, [username, page]);

    return (
        <BasicLayout>
            <div
                className={`${(isOpen) ? "opacity-50 backdrop-blur-sm z-10 overflow-y-hidden" : "z-10"} w-full flex flex-col`}>
                <div className="flex justify-between items-center text-2xl font-jalnan px-4 pb-4">
                    <div>{username}의 블로그</div>
                    <IconButton
                        icon={<MdMenu className="size-8"/>}
                        onClick={handleMenuOpen}
                        addStyle="lg:hidden"/>
                </div>
                <div className="grid lg:grid-cols-3">
                    <div className="lg:col-span-2 flex flex-col gap-y-4 p-4 lg:border-r border-r-gray-200">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}/>
                        ))}
                        {posts.length === 0 &&
                            <div className="mt-8 text-center text-gray-600">
                                작성된 게시글이 없습니다.
                            </div>}
                        <PaginationButton
                            pageInfo={pageInfo} setPage={setPage}/>
                    </div>
                    <div className="col-span-1 hidden lg:block flex-col">
                        <BlogSideBar
                            folders={folders}
                            username={username}
                            profileUrl={member.profileUrl}
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
                <BlogSideBar
                    folders={folders}
                    username={username}
                    profileUrl={member.profileUrl}
                    addTag={addTag}
                    setSelectedFolder={setSelectedFolder}
                    bgColor={"bg-gray-50"}
                    side={true}/>
            </div>
        </BasicLayout>
    );
}

export default BlogPage;