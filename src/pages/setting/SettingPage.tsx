import BasicLayout from '../../layout/BasicLayout.tsx';
import { useEffect, useRef, useState } from 'react';
import PostSettingPage from './PostSettingPage.tsx';
import ProfileSettingPage from './ProfileSettingPage.tsx';
import FolderSettingPage from './FolderSettingPage.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import SettingSideBar from '../../components/setting/SettingSideBar.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import IconButton from '../../components/common/IconButton.tsx';
import { MdMenu, MdOutlineExitToApp } from 'react-icons/md';
import SubscriptionSettingPage from './SubscriptionSettingPage.tsx';

function SettingPage() {
    const loginState = useSelector((state: RootState) => state.loginSlice);
    const { section } = useParams();
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState<string>(section || 'profile');

    const sideBarRef = useRef<HTMLDivElement | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleClickOutside = (event: MouseEvent) => {
        if (sideBarRef.current && !sideBarRef.current.contains(event.target as Node)) {
            setMenuOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        navigate(`/setting/${selectedSection}`);
    }, [selectedSection]);

    useEffect(() => {
        if (loginState.isReloaded) {
            return;
        }

        if (!loginState.isLogin) {
            alert('로그인이 필요한 페이지입니다.');
            navigate('/login');
        }
    }, [loginState.isReloaded]);

    return (
        <BasicLayout>
            <div
                ref={sideBarRef}
                className={`${
                    menuOpen ? 'block translate-x-0' : 'hidden translate-x-full'
                } absolute top-0 left-0 flex-col
                     transform transition-transform duration-300 ease-out z-20`}
            >
                <button className='absolute top-6 right-6 hover:cursor-pointer' onClick={() => setMenuOpen(false)}>
                    <MdOutlineExitToApp className='size-8 text-gray-500' />
                </button>
                <SettingSideBar setSelectedSection={setSelectedSection} side={true} />
            </div>
            <div
                className={`${
                    menuOpen ? 'opacity-50 backdrop-blur-sm z-10 overflow-y-hidden' : 'z-10'
                } px-4 flex flex-col md:flex-row w-full gap-x-4 md:gap-y-4`}
            >
                <div className='hidden md:block'>
                    <SettingSideBar setSelectedSection={setSelectedSection} side={false} />
                </div>
                <div className='block md:hidden'>
                    <IconButton icon={<MdMenu size={24} />} onClick={() => setMenuOpen(prev => !prev)} />
                </div>
                {selectedSection === 'profile' && (
                    <div className='md:border-l border-gray-200 w-full ps-8'>
                        <ProfileSettingPage />
                    </div>
                )}
                {selectedSection === 'folder' && (
                    <div className='md:border-l border-gray-200 w-full ps-8'>
                        <FolderSettingPage />
                    </div>
                )}
                {selectedSection === 'post' && (
                    <div className='md:border-l border-gray-200 w-full ps-8'>
                        <PostSettingPage />
                    </div>
                )}
                {selectedSection === 'subscription' && (
                    <div className='md:border-l border-gray-200 w-full ps-8'>
                        <SubscriptionSettingPage />
                    </div>
                )}
            </div>
        </BasicLayout>
    );
}

export default SettingPage;
