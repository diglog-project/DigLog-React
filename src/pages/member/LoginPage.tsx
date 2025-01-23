import BasicLayout from "../../layout/BasicLayout.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {loginApi} from "../../apis/member.tsx";
import {login} from "../../slices/loginSlice.tsx";

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
            <button
                onClick={handleLogin}>
                Login
            </button>
        </BasicLayout>
    );
}

export default LoginPage;