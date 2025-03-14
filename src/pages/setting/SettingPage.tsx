import BasicLayout from "../../layout/BasicLayout.tsx";
import {useEffect, useState} from "react";
import PostSettingPage from "./PostSettingPage.tsx";
import ProfileSettingPage from "./ProfileSettingPage.tsx";
import FolderSettingPage from "./FolderSettingPage.tsx";
import {useNavigate, useParams} from "react-router-dom";
import SettingSideBar from "../../components/setting/SettingSideBar.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";

function SettingPage() {

    const loginState = useSelector((state: RootState) => state.loginSlice);
    const {section} = useParams();
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState<string>(section || "profile");

    useEffect(() => {
        navigate(`/setting/${selectedSection}`);
    }, [selectedSection]);

    useEffect(() => {
        if (loginState.isReloaded) {
            return;
        }

        if (!loginState.isLogin) {
            alert("로그인이 필요한 페이지입니다.");
            navigate("/login");
        }
    }, [loginState.isReloaded]);

    return (
        <BasicLayout>
            <div className="flex w-full gap-x-4">
                <SettingSideBar setSelectedSection={setSelectedSection}/>
                {(selectedSection === "profile") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <ProfileSettingPage/>
                    </div>}
                {(selectedSection === "folder") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <FolderSettingPage/>
                    </div>}
                {(selectedSection === "post") &&
                    <div className="min-w-160 border-l border-gray-200 w-full ps-8">
                        <PostSettingPage/>
                    </div>}
            </div>
        </BasicLayout>
    );
}

export default SettingPage;