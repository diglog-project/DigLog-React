import BasicLayout from "../../layout/BasicLayout.tsx";
import {MdArrowDropDown, MdOutlineClear, MdOutlineSearch} from "react-icons/md";
import {Ref, useEffect, useRef, useState} from "react";
import * as React from "react";
import PostCard from "../../components/post/PostCard.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {LoadMoreButton} from "../../components/common/FillButton.tsx";
import {PostResponse, PostSearchRequest} from "../../common/types/post.tsx";
import {PageResponse} from "../../common/types/common.tsx";
import {searchPost} from "../../common/apis/post.tsx";
import {searchProfile} from "../../common/apis/member.tsx";
import {MemberProfileSearchResponse} from "../../common/types/member.tsx";
import ProfileImageCircle from "../../components/common/ProfileImageCircle.tsx";

function SearchPage() {

    const optionRef = useRef<HTMLDivElement | null>(null);
    const orderRef = useRef<HTMLDivElement | null>(null);

    const [openOption, setOpenOption] = useState(false);
    const [openOrder, setOpenOrder] = useState(false);

    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [blogs, setBlogs] = useState<MemberProfileSearchResponse[]>([]);
    const [trigger, setTrigger] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [postPage, setPostPage] = useState(0);
    const [blogPage, setBlogPage] = useState(0);
    const pageSize = 1;
    const [postPageInfo, setPostPageInfo] = useState<PageResponse>({
        number: 0,
        size: pageSize,
        totalPages: 0,
        totalElements: 0
    });
    const [blogPageInfo, setBlogPageInfo] = useState<PageResponse>({
        number: 0,
        size: pageSize,
        totalPages: 0,
        totalElements: 0
    });

    const [searchParams, setSearchParams] = useSearchParams({
        "keyword": "",
        "option": "ALL",
        "sort": "createdAt",
        "isDescending": "true",
        "tab": "post"
    });
    const [searchRequest, setSearchRequest] = useState<PostSearchRequest>({
        keyword: searchParams.get("keyword") || "",
        option: searchParams.get("option") || "ALL",
        sorts: [searchParams.get("sort") || "createdAt"],
        page: 0,
        size: pageSize,
        isDescending: searchParams.get("isDescending") ? searchParams.get("isDescending") === "true" : true,
    });
    const [selectedTab, setSelectedTab] = useState(searchParams.get("tab") || "post");

    const handlePostPage = () => {
        setPostPage(prev => prev + 1);
    }
    const handleBlogPage = () => {
        setBlogPage(prev => prev + 1);
    }

    const handleOpenOption = () => {
        setOpenOption(cur => !cur);
    }
    const handleOpenOrder = () => {
        setOpenOrder(cur => !cur);
    }
    const handleSetOption = (menu: MenuItem) => {
        setSearchRequest({...searchRequest, option: menu.value});
    }
    const handleSetOrder = (menu: MenuItem) => {
        setSearchRequest({...searchRequest, isDescending: (menu.value === "true")});
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (optionRef.current && !optionRef.current.contains(event.target as Node)) {
            setOpenOption(false);
        }
        if (orderRef.current && !orderRef.current.contains(event.target as Node)) {
            setOpenOrder(false);
        }
    };

    const handleSearchEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }

        handleSearch();
    }
    const handleSearch = () => {
        setPosts([]);
        setPostPage(0);

        setBlogs([]);
        setBlogPage(0);

        setTrigger(prev => !prev);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSearchParams({
            "keyword": searchRequest.keyword,
            "option": searchRequest.option,
            "sort": searchRequest.sorts[0],
            "isDescending": searchRequest.isDescending.toString(),
            "tab": selectedTab,
        });

        if (searchRequest.keyword === "") {
            return;
        }

        setPostPage(0);
        setPosts([]);
        setTrigger(prev => !prev);
    }, [searchRequest.option, searchRequest.isDescending]);

    useEffect(() => {
        setSearchParams({
            "keyword": searchRequest.keyword,
            "option": searchRequest.option,
            "sort": searchRequest.sorts[0],
            "isDescending": searchRequest.isDescending.toString(),
            "tab": selectedTab,
        });
    }, [selectedTab]);

    const handleSearchPosts = () => {
        searchPost({
            keyword: searchRequest.keyword,
            option: searchRequest.option,
            sorts: searchRequest.sorts,
            page: postPage,
            size: pageSize,
            isDescending: searchRequest.isDescending,
        })
            .then(res => {
                setPosts(prev => [...prev, ...res.data.content]);
                setPostPageInfo(res.data.page);
            })
            .catch(error => alert(error.response.data.message));
    }

    const handleSearchBlogs = () => {
        searchProfile({
            username: searchRequest.keyword,
            page: blogPage,
            size: pageSize,
        })
            .then((res) => {
                setBlogs(prev => [...prev, ...res.data.content]);
                setBlogPageInfo(res.data.page);
            })
            .catch(error => alert(error.response.data.message));
    }

    useEffect(() => {
        if (refresh) {
            setRefresh(false);
            return;
        }
        if (searchRequest.keyword === "") {
            return;
        }
        handleSearchPosts();
        handleSearchBlogs();
    }, [trigger]);

    useEffect(() => {
        if (postPage >= 1) {
            handleSearchPosts();
        }
    }, [postPage]);

    useEffect(() => {
        if (blogPage >= 1) {
            handleSearchBlogs();
        }
    }, [blogPage]);

    return (
        <BasicLayout>
            <div className="w-full flex flex-col gap-y-8">
                <div className="w-full flex flex-col max-w-xl mx-auto">
                    <div className="flex">
                        <div className="w-full relative flex justify-between items-center">
                            <input value={searchRequest.keyword}
                                   onChange={(e) => setSearchRequest({...searchRequest, keyword: e.target.value})}
                                   placeholder={"검색어를 입력해주세요."}
                                   className="w-full block mt-0.5 p-3 mr-4 font-jalnan text-xl text-gray-900 border-b-2 border-white focus:outline-none focus:border-black"
                                   onKeyDown={handleSearchEnter}/>
                            <button
                                className={`${searchRequest.keyword === "" ? "hidden" : ""} absolute right-16 rounded-full hover:cursor-pointer hover:bg-gray-1000`}
                                onClick={() => setSearchRequest({...searchRequest, keyword: ""})}>
                                <MdOutlineClear className="size-6 p-1"/>
                            </button>
                            <button className="hover:cursor-pointer"
                                    onClick={handleSearch}>
                                <MdOutlineSearch className="size-7 text-gray-600 hover:text-gray-900"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-4xl mx-auto flex flex-col gap-y-2">
                    <div className="flex justify-between items-center h-12">
                        <div className="text-lg"><span className="font-bold">
                            {selectedTab === "post" ? postPageInfo.totalElements : blogPageInfo.totalElements}
                        </span>개의 검색결과
                        </div>
                        {selectedTab === "post" &&
                            <div className="flex items-center justify-end">
                                <SearchMenu
                                    title={"검색 조건"}
                                    menus={[
                                        {key: "전체", value: "ALL"},
                                        {key: "제목", value: "TITLE"},
                                        {key: "태그", value: "TAG"},
                                    ]}
                                    setMenu={handleSetOption}
                                    open={openOption}
                                    handleOpen={handleOpenOption}
                                    value={searchRequest.option}
                                    customRef={optionRef}/>
                                <SearchMenu
                                    title={"정렬 조건"}
                                    menus={[
                                        {key: "최신순", value: "true"},
                                        {key: "오래된순", value: "false"},
                                    ]}
                                    setMenu={handleSetOrder}
                                    open={openOrder}
                                    handleOpen={handleOpenOrder}
                                    value={searchRequest.isDescending.toString()}
                                    customRef={orderRef}/>
                            </div>
                        }
                    </div>
                    <SearchTab selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
                    <SearchResults
                        posts={posts}
                        blogs={blogs}
                        postPageInfo={postPageInfo}
                        blogPageInfo={blogPageInfo}
                        handlePostPage={handlePostPage}
                        handleBlogPage={handleBlogPage}
                        selectedTab={selectedTab}/>
                </div>
            </div>
        </BasicLayout>
    );
}

function SearchTab({selectedTab, setSelectedTab}: {
    selectedTab: string,
    setSelectedTab: (tab: string) => void,
}) {

    const tabs = [
        {key: "게시글", value: "post"},
        {key: "블로그", value: "blog"},
    ];

    return (
        <div
            className="text-sm font-bold text-center text-gray-500">
            <ul className="flex flex-wrap">
                {tabs.map((tab) => (
                    <li key={tab.key} className="me-2">
                        <button onClick={() => setSelectedTab(tab.value)}
                                className={`${(selectedTab === tab.value) ? "border-b-2 text-lime-400 border-lime-400" : "hover:border-b-2 hover:text-lime-400 hover:border-lime-400"} inline-block p-4 hover:cursor-pointer`}>
                            {tab.key}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SearchResults({posts, blogs, postPageInfo, blogPageInfo, handlePostPage, handleBlogPage, selectedTab}: {
    posts: PostResponse[],
    blogs: MemberProfileSearchResponse[],
    postPageInfo: PageResponse,
    blogPageInfo: PageResponse,
    handlePostPage: () => void,
    handleBlogPage: () => void,
    selectedTab: string
}) {

    if (selectedTab === "post") {
        return (
            <div className="my-2">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}/>
                ))}
                {postPageInfo.number + 1 < postPageInfo.totalPages &&
                    <LoadMoreButton
                        onClick={handlePostPage}
                        addStyle={"w-full"}/>}
            </div>
        );
    } else if (selectedTab === "blog") {
        return (
            <div className="flex flex-col divide-y divide-gray-200 z-0">
                {blogs.map((blog) => (
                    <Link key={blog.username} to={`/blog/${blog.username}`} target="_blank"
                          className="flex justify-start items-center px-4 py-6 gap-8 divide-y divide-gray-200 hover:bg-gray-100 shadow-gray-400 duration-300 ease-out">
                        <ProfileImageCircle profileUrl={blog.profileUrl || ""} size="lg"/>
                        <div className="flex flex-col gap-y-1 justify-center items-start">
                            <div className="text-2xl font-black">{blog.username}</div>
                        </div>
                    </Link>
                ))}
                {blogPageInfo.number + 1 < blogPageInfo.totalPages &&
                    <LoadMoreButton
                        onClick={handleBlogPage}
                        addStyle={"w-full"}/>}
            </div>
        );
    }

    return <></>;
}

interface MenuItem {
    key: string,
    value: string,
}

function SearchMenu({title, menus, setMenu, value, open, handleOpen, customRef}: {
    title: string,
    menus: MenuItem[],
    setMenu: (menu: MenuItem) => void,
    value: string,
    open: boolean,
    handleOpen: () => void,
    customRef: Ref<HTMLDivElement>,
}) {

    return (
        <div ref={customRef} className="z-50">
            <div className="flex justify-start items-center">
                <p>{title}</p>
                <div className="relative">
                    <button
                        className="w-28 shrink-0 z-10 inline-flex justify-between items-center py-2.5 px-4 text-sm font-medium text-gray-900 hover:cursor-pointer"
                        onClick={handleOpen}
                    >
                        {menus.find(menuItem => menuItem.value === value)?.key}
                        <MdArrowDropDown className="size-4"/>
                    </button>
                    <div
                        className={`${(open) ? "" : "hidden"} absolute top-10 left-0 flex flex-col z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44`}>
                        <ul className="py-2 text-sm text-gray-700r">
                            {menus.map((menu) => (
                                <SortMenu key={menu.value}
                                          menu={menu}
                                          setMenu={setMenu}
                                          value={value}
                                          handleOpen={handleOpen}/>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SortMenu({menu, setMenu, value, handleOpen}: {
    menu: MenuItem,
    setMenu: (menu: MenuItem) => void,
    value: string,
    handleOpen: () => void
}) {
    return (
        <li>
            <button type="button"
                    onClick={() => {
                        setMenu(menu);
                        handleOpen();
                    }}
                    className={`${(value === menu.value) ? "bg-gray-100" : ""} inline-flex w-full px-4 py-2 hover:bg-gray-200 hover:cursor-pointer`}>
                {menu.key}
            </button>
        </li>
    );
}

export default SearchPage;