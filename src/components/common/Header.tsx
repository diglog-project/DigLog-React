import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";

function Header() {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    return (
        <div className="flex justify-between items-center w-full">
            <Link to={"/"}>
                <div
                    className="flex items-center justify-center w-full">
                    <img className="h-24 pt-4" src="/logo-full.png" alt="Logo"/>
                </div>
            </Link>
            {loginState.isLogin
                ? <div>
                    <div
                        className="flex justify-around items-center w-full">
                        {loginState.email}, {loginState.username}
                    </div>
                </div>
                : <Link to={"/login"}>
                    <div
                        className="flex justify-around items-center w-full">
                        로그인
                    </div>
                </Link>}
        </div>
    );
}

export default Header;