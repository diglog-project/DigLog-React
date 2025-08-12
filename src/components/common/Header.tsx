import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import { useEffect, useRef, useState } from 'react';
import { TextLink } from './TextButton.tsx';
import { MdOutlineSearch } from 'react-icons/md';
import IconButton from './IconButton.tsx';
import { getProfile, logoutApi } from '../../common/apis/member.tsx';
import { logout, setProfile, setReloadedFalse } from '../../common/slices/loginSlice.tsx';
import ProfileImageCircle from './ProfileImageCircle.tsx';

function Header() {
    const dispatch = useDispatch();
    const loginState = useSelector((state: RootState) => state.loginSlice);
    const navigate = useNavigate();

    const dashboardRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!loginState.isReloaded) {
            return;
        }

        if (loginState.isLogin) {
            return;
        }

        getProfile()
            .then(res => {
                dispatch(
                    setProfile({
                        email: res.data.email,
                        username: res.data.username,
                        profileUrl: res.data.profileUrl,
                    }),
                );
            })
            .catch(() => {
                dispatch(setReloadedFalse());
            });
    }, []);

    const handleDropDown = () => {
        setIsOpen(cur => !cur);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        logoutApi(loginState.email)
            .then(() => {
                logout();
            })
            .catch(error => {
                alert(`알 수 없는 에러 : ${error.message}`);
            })
            .finally(() => {
                navigate(0);
            });
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='border border-b-2 border-gray-200 px-4 flex justify-between items-center w-full'>
            <Link to={'/'} className='flex items-center justify-center gap-x-2'>
                <img src='/logo.png' alt='logo' className='size-8 mb-1' />
                <div className='flex items-center text-lg h-16 font-jalnan'>DIGLOG</div>
            </Link>
            <div className='flex justify-center items-center gap-x-3'>
                <IconButton
                    icon={<MdOutlineSearch className='size-5' />}
                    onClick={() => navigate('/search?word=&option=ALL&sort=createdAt&isDescending=true&tab=post')}
                />
                {loginState.isLogin ? (
                    <div ref={dashboardRef}>
                        <div className='relative flex justify-around items-center w-full'>
                            <ProfileImageCircle profileUrl={loginState.profileUrl} onClick={handleDropDown} />
                            <div
                                className={`${
                                    isOpen ? '' : 'hidden'
                                } absolute z-99 top-12 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44`}
                            >
                                <div className='flex flex-col gap-1 px-4 py-3 text-sm text-gray-900'>
                                    <div className='font-medium truncate'>{loginState.username}</div>
                                    <div className='font-medium truncate'>{loginState.email}</div>
                                </div>
                                <div className='py-2 text-sm'>
                                    <Link
                                        to={`/write`}
                                        className='w-full block px-4 py-2 text-gray-700 hover:bg-gray-100'
                                    >
                                        게시글 작성
                                    </Link>
                                    <Link
                                        to={`/blog/${loginState.username}`}
                                        className='w-full block px-4 py-2 text-gray-700 hover:bg-gray-100'
                                    >
                                        내 블로그
                                    </Link>
                                    <Link
                                        to={`/setting/profile`}
                                        className='w-full block px-4 py-2 text-gray-700 hover:bg-gray-100'
                                    >
                                        설정
                                    </Link>
                                </div>
                                <div className='py-1'>
                                    <button
                                        onClick={handleLogout}
                                        className='w-full block px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer'
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-center items-center mr-4'>
                        <TextLink text={'로그인'} to={'/login'} addStyle={'hover:text-lime-700'} />
                        <TextLink
                            text={'회원가입'}
                            to={'/signup/platform'}
                            addStyle={'hover:text-lime-700 hidden sm:block'}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
