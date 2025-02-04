import BasicLayout from "../../layout/BasicLayout.tsx";
import LoginTextField from "../../components/member/LoginTextField.tsx";
import {useState} from "react";
import LoginButton from "../../components/member/LoginButton.tsx";
import {useNavigate} from "react-router-dom";

function EmailPage() {

    const [signupInfo, setSignupInfo] = useState({email: "", code: "", password: ""});

    const navigate = useNavigate();

    return (
        <BasicLayout>
            <div className="flex flex-col gap-y-4 justify-center items-start h-[calc(100vh-220px)]">
                <LoginTextField
                    label={"이메일"}
                    type={"email"}
                    placeholder={"diglog@example.com"}
                    value={signupInfo.email}
                    setValue={(value) => setSignupInfo({...signupInfo, email: value})}/>
                <LoginButton text={"인증코드 전송"} onClick={() => {
                    navigate("/signup/code");
                }} bgColor={"bg-lime-400"}/>
            </div>
        </BasicLayout>
    );
}

export default EmailPage;