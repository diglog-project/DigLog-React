import BasicLayout from "../../layout/BasicLayout.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {handleKakaoLogin, loginApi} from "../../common/apis/member.tsx";
import {login} from "../../common/slices/loginSlice.tsx";
import LoginButton from "../../components/member/LoginButton.tsx";
import LoginTextField from "../../components/member/LoginTextField.tsx";
import {checkEmail} from "../../common/util/regex.tsx";
import * as React from "react";
import {TextLink} from "../../components/common/TextButton.tsx";

function LoginPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loginInfo, setLoginInfo] = useState({email: "", password: ""});

    const handleLogin = () => {
        loginApi(loginInfo.email, loginInfo.password)
            .then(res => {
                dispatch(login({
                    email: res.data.email,
                    roles: res.data.roles,
                    username: res.data.username,
                    accessToken: res.headers.authorization,
                }));
                navigate("/");
            })
            .catch(err => {
                alert(err);
            })
    }

    const handlePasswordEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }
        if (!checkEmail(loginInfo.email)) {
            alert("이메일 형식을 확인해주세요.");
            return;
        }

        handleLogin();
    }

    return (
        <BasicLayout>
            <div
                className="flex flex-col justify-center items-center gap-y-4 w-full max-w-[calc(420px)] h-[calc(100vh-220px)] mx-auto">
                <div className="flex justify-center items-center gap-x-2 mb-8">
                    <img src="/logo.png" alt="logo"
                         className="size-16 mb-1"/>
                    <div className="flex items-center text-2xl h-16 font-jalnan">
                        DIGLOG
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center w-full">
                    <LoginTextField
                        label={"이메일"}
                        type={"email"}
                        placeholder={"diglog@example.com"}
                        value={loginInfo.email}
                        setValue={(value) => setLoginInfo({...loginInfo, email: value})}/>
                    <LoginTextField
                        label={"비밀번호"}
                        type={"password"}
                        placeholder={"영문, 숫자 포함 8-16자"}
                        value={loginInfo.password}
                        setValue={(value) => setLoginInfo({...loginInfo, password: value})}
                        onKeyDown={handlePasswordEnter}/>
                </div>
                <div className="flex flex-col justify-center items-center gap-y-4 w-full">
                    <LoginButton text={"로그인"} onClick={handleLogin} bgColor={"bg-lime-300"}/>
                    <LoginButton text={"카카오로 시작하기"} onClick={handleKakaoLogin} bgColor={"bg-[#FEE500]"}
                                 icon={<img src={"/kakao-logo.png"} alt={"Kakao Login"} className="size-5"/>}/>
                    <TextLink text={"회원가입"} to={"/signup/platform"} addStyle={"w-full h-14 hover:text-gray-600"}/>
                </div>
            </div>
        </BasicLayout>
    );
}

export default LoginPage;