import BasicLayout from "../../layout/BasicLayout.tsx";
import LoginButton from "../../components/member/LoginButton.tsx";
import {handleKakaoLogin} from "../../common/apis/member.tsx";
import {TextLink} from "../../components/common/TextButton.tsx";

function PlatformPage() {

    return (
        <BasicLayout>
            <div className="w-full max-w-[calc(420px)] h-[calc(100vh-220px)] flex flex-col justify-center items-center gap-y-4 mx-auto">
                <LoginButton text={"카카오로 시작하기"} onClick={handleKakaoLogin} bgColor={"bg-[#FEE500]"}
                             icon={<img src={"/kakao-logo.png"} alt={"Kakao Login"} className="size-5"/>}/>
                <TextLink text={"이메일로 회원가입"} to={"/signup/email"} addStyle={"hover:text-gray-600"}/>
            </div>
        </BasicLayout>
    );
}

export default PlatformPage;