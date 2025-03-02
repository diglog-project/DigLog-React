import BasicLayout from "../../layout/BasicLayout.tsx";
import {MdArrowDropDown, MdOutlineClear, MdOutlineSearch} from "react-icons/md";
import {Ref, useEffect, useRef, useState} from "react";
import * as React from "react";
// import PostCard from "../../components/post/PostCard.tsx";
import {faker} from "@faker-js/faker/locale/ko";
import {Link, useSearchParams} from "react-router-dom";
import {LoadMoreButton} from "../../components/common/FillButton.tsx";

function SearchPage() {

    const optionRef = useRef<HTMLDivElement | null>(null);
    const sortRef = useRef<HTMLDivElement | null>(null);

    const [openOption, setOpenOption] = useState(false);
    const [openSort, setOpenSort] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams({"word": "", "option": "전체", "sort": "최신순", "tab": "게시글"});
    const [searchWord, setSearchWord] = useState<string>(searchParams.get("word") || "");
    const [option, setOption] = useState<string>(searchParams.get("option") || "전체");
    const [sort, setSort] = useState<string>(searchParams.get("sort") || "최신순");
    const [selectedTab, setSelectedTab] = useState<string>(searchParams.get("tab") || "게시글");

    const handleOpenOption = () => {
        setOpenOption(cur => !cur);
    }
    const handleOpenSort = () => {
        setOpenSort(cur => !cur);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (optionRef.current && !optionRef.current.contains(event.target as Node)) {
            setOpenOption(false);
        }
        if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
            setOpenSort(false);
        }
    };

    const handleSearchEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }
        handleSearchWord();
    }

    const handleSearchWord = () => {
        if (searchWord === "") {
            return;
        }

        setSearchParams({
            "word": searchWord,
            "option": option,
            "sort": sort,
            "tab": selectedTab,
        });
    }

    useEffect(() => {
        setSearchParams({
            "word": searchWord,
            "option": option,
            "sort": sort,
            "tab": selectedTab,
        });
    }, [option, sort, selectedTab]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <BasicLayout>
            <div className="w-full flex flex-col gap-y-8">
                <div className="w-full flex flex-col max-w-xl mx-auto">
                    <div className="flex">
                        <div className="w-full relative flex justify-between items-center">
                            <input value={searchWord}
                                   onChange={(e) => setSearchWord(e.target.value)}
                                   placeholder={"검색어를 입력해주세요."}
                                   className="w-full block mt-0.5 p-3 mr-4 font-jalnan text-xl text-gray-900 border-b-2 border-white focus:outline-none focus:border-black"
                                   onKeyDown={handleSearchEnter}/>
                            <button
                                className={`${searchWord === "" ? "hidden" : ""} absolute right-16 rounded-full hover:cursor-pointer hover:bg-gray-1000`}
                                onClick={() => setSearchWord("")}>
                                <MdOutlineClear className="size-6 p-1"/>
                            </button>
                            <button className="hover:cursor-pointer"
                                    onClick={handleSearchWord}>
                                <MdOutlineSearch className="size-7 text-gray-600 hover:text-gray-900"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-4xl mx-auto flex flex-col gap-y-2">
                    <div className="flex justify-between items-center">
                        <div className="text-lg"><span className="font-bold">99</span>개의 검색결과</div>
                        <div className="flex items-center justify-end">
                            <SearchMenu
                                type={"option"}
                                open={openOption}
                                handleOpen={handleOpenOption}
                                value={option}
                                setValue={setOption}
                                customRef={optionRef}/>
                            <SearchMenu
                                type={"sort"}
                                open={openSort}
                                handleOpen={handleOpenSort}
                                value={sort}
                                setValue={setSort}
                                customRef={sortRef}/>
                        </div>
                    </div>
                    <SearchTab selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
                    <SearchResults selectedTab={selectedTab}/>
                </div>
            </div>
        </BasicLayout>
    );
}

function SearchTab({selectedTab, setSelectedTab}: {
    selectedTab: string,
    setSelectedTab: (tab: string) => void,
}) {

    const tabs = ["게시글", "블로그"];

    return (
        <div
            className="text-sm font-bold text-center text-gray-500">
            <ul className="flex flex-wrap">
                {tabs.map((tab) => (
                    <li key={tab} className="me-2">
                        <button onClick={() => setSelectedTab(tab)}
                                className={`${(selectedTab === tab) ? "border-b-2 text-lime-400 border-lime-400" : "hover:border-b-2 hover:text-lime-400 hover:border-lime-400"} inline-block p-4 hover:cursor-pointer`}>
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SearchResults({selectedTab}: { selectedTab: string }) {

    if (selectedTab === "게시글") {
        return (
            <div className="my-2">
                {/*{(Array.from({length: 5}).map(() => (*/}
                {/*    <PostCard*/}
                {/*        key={faker.number.int().toString()}*/}
                {/*        id={faker.number.int().toString()}*/}
                {/*        title={faker.lorem.sentence()}*/}
                {/*        content={`${faker.lorem.paragraphs()}<img src=${faker.image.url({*/}
                {/*            width: 320,*/}
                {/*            height: 320*/}
                {/*        })}/>`}*/}
                {/*        username={faker.animal.cat()}*/}
                {/*        tags={[{*/}
                {/*            id: faker.number.int().toString(),*/}
                {/*            name: faker.word.sample()*/}
                {/*        }, {id: faker.number.int().toString(), name: faker.word.sample()}]}*/}
                {/*        createdAt={new Date()}/>*/}
                {/*)))}*/}
                <LoadMoreButton onClick={() => {
                }} addStyle={"w-full"}/>
            </div>
        );
    } else if (selectedTab === "블로그") {
        return (
            <div className="flex flex-col divide-y divide-gray-200 z-0">
                {(Array.from({length: 5}).map(() => (
                    <Link key={faker.animal.dog()} to={`/blog/${faker.animal.dog()}`}
                          className="flex justify-start items-center px-4 py-6 gap-8 divide-y divide-gray-200 hover:bg-gray-100 shadow-gray-400 duration-300 ease-out">
                        <img className="border border-gray-300 size-32 rounded-full"
                             src={faker.image.avatar()} alt="username"/>
                        <div className="flex flex-col gap-y-1 justify-center items-start">
                            <div className="text-2xl font-black">{faker.animal.dog()}</div>
                            <div className="text-gray-600">{faker.animal.dog()}</div>
                            <div className="text-gray-600">{faker.animal.dog()}</div>
                        </div>
                    </Link>
                )))}
                <LoadMoreButton onClick={() => {
                }}/>
            </div>
        );
    }

    return <></>;
}

function SearchMenu({type, open, handleOpen, value, setValue, customRef}: {
    type: string,
    open: boolean,
    handleOpen: () => void,
    value: string,
    setValue: (newOption: string) => void,
    customRef: Ref<HTMLDivElement>,
}) {

    let title = "";
    let searchMenuList: string[] = [];
    if (type === "option") {
        title = "검색 조건";
        searchMenuList = ["전체", "제목", "내용", "태그", "작성자"];
    } else if (type === "sort") {
        title = "정렬 조건";
        searchMenuList = ["최신순", "오래된순", "조회순"];
    }

    return (
        <div ref={customRef} className="z-50">
            <div className="flex justify-start items-center">
                <p>{title}</p>
                <div className="relative">
                    <button
                        className="w-28 shrink-0 z-10 inline-flex justify-between items-center py-2.5 px-4 text-sm font-medium text-gray-900 hover:cursor-pointer"
                        onClick={handleOpen}
                    >
                        {value}
                        <MdArrowDropDown className="size-4"/>
                    </button>
                    <div
                        className={`${(open) ? "" : "hidden"} absolute top-10 left-0 flex flex-col z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44`}>
                        <ul className="py-2 text-sm text-gray-700r">
                            {searchMenuList.map((menu) => (
                                <SortMenu key={menu} value={menu} current={value} setValue={setValue}
                                          handleOpen={handleOpen}/>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SortMenu({value, current, setValue, handleOpen}: {
    value: string,
    current: string,
    setValue: (newSort: string) => void,
    handleOpen: () => void
}) {
    return (
        <li>
            <button type="button"
                    onClick={() => {
                        setValue(value);
                        handleOpen();
                    }}
                    className={`${(value === current) ? "bg-gray-100" : ""} inline-flex w-full px-4 py-2 hover:bg-gray-200 hover:cursor-pointer`}>
                {value}
            </button>
        </li>
    );
}

export default SearchPage;