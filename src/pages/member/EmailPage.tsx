import BasicLayout from "../../layout/BasicLayout.tsx";
import LoginTextField from "../../components/member/LoginTextField.tsx";
import {useEffect, useRef, useState} from "react";
import LoginButton from "../../components/member/LoginButton.tsx";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {checkEmail} from "../../common/util/regex.tsx";
import {sendMail} from "../../common/apis/member.tsx";
import LoadingLayout from "../../layout/LoadingLayout.tsx";

function EmailPage() {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const emailRef = useRef<HTMLInputElement>(null);

    const handleEmailEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }

        handleVerifyEmail();
    }

    const handleVerifyEmail = () => {
        if (!checkEmail(email)) {
            alert("이메일 형식에 맞게 입력해주세요.");
            return;
        }
        setLoading(true);

        sendMail(email)
            .then(() => {
                navigate("/signup/code", {state: {email: email}});
            })
            .catch((error) => alert(error.response.data.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    return (
        <BasicLayout center={true}>
            <div
                className="w-full max-w-[calc(420px)] flex flex-col justify-center items-start">
                <LoginTextField
                    label={"이메일"}
                    type={"email"}
                    placeholder={"diglog@example.com"}
                    value={email}
                    setValue={(value) => setEmail(value)}
                    customRef={emailRef}
                    onKeyDown={handleEmailEnter}/>
                <LoginButton text={"인증코드 전송"} onClick={handleVerifyEmail} disable={!checkEmail(email)} bgColor={"bg-lime-400"}/>
            </div>
            <LoadingLayout loading={loading}/>
        </BasicLayout>
    );
}

export default EmailPage;