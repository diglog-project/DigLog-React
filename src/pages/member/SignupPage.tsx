import BasicLayout from "../../layout/BasicLayout.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import LoginTextField from "../../components/member/LoginTextField.tsx";
import {checkPassword} from "../../common/util/regex.tsx";
import LoadingLayout from "../../layout/LoadingLayout.tsx";
import * as React from "react";
import LoginButton from "../../components/member/LoginButton.tsx";
import {signup} from "../../common/apis/member.tsx";

function SignupPage() {

    const navigate = useNavigate();
    const {state} = useLocation();
    const {email, code} = state;

    const [loading, setLoading] = useState(false);
    const [passwordInfo, setPasswordInfo] = useState({password: "", confirmPassword: ""});

    const handlePasswordEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }

        handleSignup();
    }

    const handleSignup = () => {
        if (!checkPassword(passwordInfo.password)) {
            alert("비밀번호가 영문, 숫자 포함 8-16자리가 되도록 입력해주세요.");
            return;
        }
        
        if (passwordInfo.password !== passwordInfo.confirmPassword) {
            alert("비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        setLoading(true);

        signup(email, passwordInfo.password, code)
            .then(() => {
                alert("회원가입 되었습니다.");
                navigate("/login");
            })
            .catch((error) => alert(error.response.data.message))
            .finally(() => setLoading(false));
    }

    const disableSignupButton = () => {
        return !checkPassword(passwordInfo.password) || (passwordInfo.password !== passwordInfo.confirmPassword);
    }

    return (
        <BasicLayout center={true}>
            <div
                className="w-full max-w-[calc(420px)] flex flex-col justify-center items-center gap-y-4">
                <p className="mb-4">비밀번호 설정을 마치면 회원가입이 완료됩니다.</p>
                <div className="w-full">
                    <LoginTextField
                        label={"비밀번호"}
                        type={"password"}
                        placeholder={"영문, 숫자 포함 8-16자"}
                        value={passwordInfo.password}
                        setValue={(value) => setPasswordInfo({...passwordInfo, password: value})}/>
                    <LoginTextField
                        label={"비밀번호 확인"}
                        type={"password"}
                        placeholder={"영문, 숫자 포함 8-16자"}
                        value={passwordInfo.confirmPassword}
                        setValue={(value) => setPasswordInfo({...passwordInfo, confirmPassword: value})}
                        onKeyDown={handlePasswordEnter}/>
                </div>
                <LoginButton text={"회원가입"} onClick={handleSignup} disable={disableSignupButton()} bgColor={"bg-lime-400"}/>
            </div>
            <LoadingLayout loading={loading}/>
        </BasicLayout>
    );
}

export default SignupPage;