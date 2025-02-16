import BasicLayout from "../../layout/BasicLayout.tsx";
import {useState} from "react";
import PostSettingPage from "./PostSettingPage.tsx";
import ProfileSettingPage from "./ProfileSettingPage.tsx";
import FolderSettingPage from "./FolderSettingPage.tsx";

function SettingPage() {

    const tabList = ["프로필", "폴더", "게시글"];

    const [selectedTab, setSelectedTab] = useState("프로필");

    return (
        <BasicLayout>
            <div className="flex w-full gap-x-4">
                <div
                    className="w-52 h-full flex flex-col justify-start items-start">
                    <ul className="w-full flex flex-col gap-y-1.5 flex-wrap">
                        {tabList.map((tab) =>
                            <li key={tab}>
                                <button
                                    onClick={() => setSelectedTab(tab)}
                                    className="text-left w-full p-2 my-1 hover:bg-gray-200 hover:cursor-pointer">
                                    {tab}
                                </button>
                            </li>)}
                    </ul>
                </div>
                {(selectedTab === "프로필") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <ProfileSettingPage/>
                    </div>}
                {(selectedTab === "폴더") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <FolderSettingPage/>
                    </div>}
                {(selectedTab === "게시글") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <PostSettingPage/>
                    </div>}
            </div>
        </BasicLayout>
    );
}

export default SettingPage;