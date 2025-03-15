import BasicLayout from "../../layout/BasicLayout.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getProfile, handleKakaoLogin, loginApi} from "../../common/apis/member.tsx";
import {login, setProfile} from "../../common/slices/loginSlice.tsx";
import LoginButton from "../../components/member/LoginButton.tsx";
import LoginTextField from "../../components/member/LoginTextField.tsx";
import {checkEmail} from "../../common/util/regex.tsx";
import * as React from "react";
import {TextLink} from "../../components/common/TextButton.tsx";
import {RootState} from "../../store.tsx";

function LoginPage() {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [loginInfo, setLoginInfo] = useState({email: "", password: ""});

    const handleLogin = () => {
        loginApi(loginInfo.email, loginInfo.password)
            .then(res => {
                dispatch(login({
                    ...loginState,
                    email: res.data.email,
                    roles: res.data.roles,
                    username: res.data.username,
                    accessToken: res.headers.authorization,
                }));

                getProfile()
                    .then(res => {
                        dispatch(setProfile({
                            email: res.data.email,
                            username: res.data.username,
                            profileUrl: res.data.profileUrl,
                        }));
                    });

                navigate("/");
            })
            .catch(error => alert(error.response.data.message));
    }

    const handleEmailEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }

        passwordRef.current?.focus();
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

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    return (
        <BasicLayout center={true}>
            <div
                className="w-full max-w-[calc(420px)] flex flex-col justify-center items-center gap-y-4">
                <div className="flex justify-center items-center gap-x-2 mb-8">
                    <img src="/logo.png" alt="logo"
                         className="size-16 mb-1"/>
                    <div className="flex items-center text-2xl h-16 font-jalnan">
                        DIGLOG
                    </div>
                </div>
                <form onSubmit={e => e.preventDefault()} className="flex flex-col justify-center items-center w-full">
                    <LoginTextField
                        label={"이메일"}
                        type={"email"}
                        placeholder={"이메일을 입력해주세요."}
                        value={loginInfo.email}
                        setValue={(value) => setLoginInfo({...loginInfo, email: value})}
                        customRef={emailRef}
                        onKeyDown={handleEmailEnter}/>
                    <LoginTextField
                        label={"비밀번호"}
                        type={"password"}
                        placeholder={"비밀번호를 입력해주세요."}
                        value={loginInfo.password}
                        setValue={(value) => setLoginInfo({...loginInfo, password: value})}
                        customRef={passwordRef}
                        onKeyDown={handlePasswordEnter}/>
                </form>
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