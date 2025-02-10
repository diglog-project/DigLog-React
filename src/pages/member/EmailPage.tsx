import BasicLayout from "../../layout/BasicLayout.tsx";
import LoginTextField from "../../components/member/LoginTextField.tsx";
import {useState} from "react";
import LoginButton from "../../components/member/LoginButton.tsx";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {checkEmail} from "../../common/util/regex.tsx";

function EmailPage() {

    const [signupInfo, setSignupInfo] = useState({email: "", code: "", password: ""});

    const navigate = useNavigate();

    const handleEmailEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }

        handleVerifyEmail();
    }

    const handleVerifyEmail = () => {
        if (!checkEmail(signupInfo.email)) {
            alert("이메일 형식을 확인해주세요.");
            return;
        }

        navigate("/signup/code", {state: {email: signupInfo.email}});
    }

    return (
        <BasicLayout center={true}>
            <div
                className="w-full max-w-[calc(420px)] flex flex-col justify-center items-start">
                <LoginTextField
                    label={"이메일"}
                    type={"email"}
                    placeholder={"diglog@example.com"}
                    value={signupInfo.email}
                    setValue={(value) => setSignupInfo({...signupInfo, email: value})}
                    onKeyDown={handleEmailEnter}/>
                <LoginButton text={"인증코드 전송"} onClick={handleVerifyEmail} bgColor={"bg-lime-400"}/>
            </div>
        </BasicLayout>
    );
}

export default EmailPage;