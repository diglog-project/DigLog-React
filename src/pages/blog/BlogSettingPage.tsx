import BasicLayout from "../../layout/BasicLayout.tsx";
import {useState} from "react";

function BlogSettingPage() {

    const [selectedTab, setSelectedTab] = useState("카테고리");
    const tabList = ["카테고리", "게시글"];

    return (
        <BasicLayout>
            <div className="flex w-full max-w-2xl gap-x-4 divide-x divide-gray-200">
                <div
                    className="w-64 h-full flex flex-col justify-start items-start">
                    <ul className="w-full flex flex-col gap-y-1.5 flex-wrap">
                        {tabList.map((tab) =>
                            <li key={tab}>
                                <button
                                    onClick={() => setSelectedTab(tab)}
                                    className="text-left w-full p-2 my-1 hover:bg-gray-200">
                                    {tab}
                                </button>
                            </li>)}
                    </ul>
                </div>
                <BlogSettingMain selectedTab={selectedTab}/>
            </div>
        </BasicLayout>
    );
}

function BlogSettingMain({selectedTab}: { selectedTab: string }) {

    if (selectedTab === "카테고리") {
        return (
            <div className="w-full">
                {selectedTab}
                폴더 설정, 블로그 대문 이름?, 게시글 삭제?
            </div>
        );
    } else if (selectedTab === "게시글") {
        return (
            <div className="w-full">
                {selectedTab}
                폴더 설정, 블로그 대문 이름?, 게시글 삭제?
            </div>
        );
    }

    return <></>;
}

export default BlogSettingPage;