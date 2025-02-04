import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";
import {faker} from "@faker-js/faker/locale/ko";
import {useEffect, useRef, useState} from "react";
import {TextLink} from "./TextButton.tsx";
import {MdOutlineSearch} from "react-icons/md";

function Header() {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    const dashboardRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleDropDown = () => {
        setIsOpen(cur => !cur);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="border border-b-2 border-gray-200 px-4 flex justify-between items-center w-full">
            <Link to={"/"} className="flex items-center justify-center gap-x-3 ml-4">
                <img src="/logo.png" alt="logo"
                     className="size-10 mb-1"/>
                <div className="flex items-center text-xl h-16 font-jalnan">
                    DIGLOG
                </div>
            </Link>
            <div className="flex justify-center items-center gap-x-3">
                <MdOutlineSearch className="h-6 w-6"/>
                {loginState.isLogin
                    ? <div ref={dashboardRef}>
                        <div
                            className="relative flex justify-around items-center w-full">
                            <img className="w-10 h-10 rounded-full hover:cursor-pointer"
                                 onClick={handleDropDown}
                                 src={faker.image.avatar()} alt="user_image"/>
                            <div
                                className={`${isOpen ? "" : "hidden"} absolute z-50 top-12 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44`}>
                                <div className="flex flex-col gap-1 px-4 py-3 text-sm text-gray-900">
                                    <div className="font-medium truncate">{loginState.username}</div>
                                    <div className="font-medium truncate">{loginState.email}</div>
                                </div>
                                <div className="py-2 text-sm">
                                    <Link to={`/blog/${loginState.username}`}
                                          className="w-full block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        내 블로그
                                    </Link>
                                    <Link to={"/profile"}
                                          className="w-full block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        프로필
                                    </Link>
                                </div>
                                <div className="py-1">
                                    <button
                                        className="w-full block px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer">
                                        로그아웃
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div className="flex justify-center items-center mr-4">
                        <TextLink text={"로그인"} to={"/login"} addStyle={"hover:text-lime-700"}/>
                        <TextLink text={"회원가입"} to={"/signup"} addStyle={"hover:text-lime-700"}/>
                    </div>}
            </div>
        </div>
    );
}

export default Header;