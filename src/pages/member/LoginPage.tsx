import BasicLayout from "../../layout/BasicLayout.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {handleKakaoLogin, loginApi} from "../../common/apis/member.tsx";
import {login} from "../../common/slices/loginSlice.tsx";
import {FillButton} from "../../components/common/FillButton.tsx";

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

    return (
        <BasicLayout>
            <div className="flex flex-col justify-center items-center gap-4 w-full h-[calc(100vh-232px)]">
                <input
                    type="email"
                    value={loginInfo.email}
                    placeholder="email"
                    onChange={(e) => setLoginInfo({...loginInfo, email: e.target.value})}/>
                <input
                    type="password"
                    value={loginInfo.password}
                    placeholder="password"
                    onChange={(e) => setLoginInfo({...loginInfo, password: e.target.value})}/>
                <FillButton text={"로그인"} onClick={handleLogin} addStyle={"w-75"} />
                <button onClick={handleKakaoLogin} className="hover:cursor-pointer hover:brightness-105">
                    <img src="/kakao_login_medium_wide.png" alt="kakao login"/>
                </button>
            </div>
        </BasicLayout>
    );
}

export default LoginPage;