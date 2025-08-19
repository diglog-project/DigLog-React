import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import { useEffect, useRef, useState } from 'react';
import { TextLink } from './TextButton.tsx';
import { MdNotificationsNone, MdOutlineSearch } from 'react-icons/md';
import IconButton from './IconButton.tsx';
import { getProfile, logoutApi } from '../../common/apis/member.tsx';
import { logout, setProfile, setReloadedFalse, setSseConnected } from '../../common/slices/loginSlice.tsx';
import ProfileImageCircle from './ProfileImageCircle.tsx';
import { NotificationResponse } from '../../common/types/notification.tsx';
import { Event, EventSourcePolyfill } from 'event-source-polyfill';
import { relativeDateToKorean } from '../../common/util/date.tsx';

function Header() {
    const dispatch = useDispatch();
    const loginState = useSelector((state: RootState) => state.loginSlice);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

    const dashboardRef = useRef<HTMLDivElement | null>(null);
    const [isDashBoardOpen, setIsDashBoardOpen] = useState(false);

    const notificationRef = useRef<HTMLDivElement | null>(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
    }, [loginState.isReloaded, loginState.isLogin, dispatch]);

    useEffect(() => {
        const connect = () => {
            if (!loginState.isLogin) {
                dispatch(setSseConnected({ sseConnected: false }));
                return;
            }

            if (loginState.sseConnected) {
                return;
            }

            const eventSource = new EventSourcePolyfill(
                `${import.meta.env.VITE_SERVER_URL}/api/notifications/sse/subscribe`,
                {
                    headers: {
                        Authorization: loginState.accessToken,
                    },
                    heartbeatTimeout: 600000, // 10분
                },
            );

            eventSource.addEventListener('notify', (res: Event) => {
                const messageEvent = res as MessageEvent;
                setNotifications(prev => [
                    ...prev,
                    {
                        date: new Date(),
                        message: messageEvent.data,
                    },
                ]);
                console.log('새로운 스레드 알림 수신');
            });

            // 연결 상태 확인
            function checkConnectionStatus() {
                switch (eventSource.readyState) {
                    case EventSource.CONNECTING:
                        dispatch(setSseConnected({ sseConnected: true }));
                        return 'connecting';
                    case EventSource.OPEN:
                        return 'connected';
                    case EventSource.CLOSED:
                        dispatch(setSseConnected({ sseConnected: false }));
                        return 'disconnected';
                    default:
                        return 'unknown';
                }
            }

            // 주기적으로 상태 확인
            setInterval(() => {
                console.log('현재 SSE 상태:', checkConnectionStatus());
            }, 5000);

            return () => {
                eventSource.close();
            };
        };

        return connect();
    }, [loginState.isLogin, loginState.accessToken, dispatch]);

    const handleDashBoardDropDown = () => {
        setIsDashBoardOpen(cur => !cur);
        setIsNotificationOpen(false);
    };

    const handleNotificationDropDown = () => {
        setIsNotificationOpen(cur => !cur);
        setIsDashBoardOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        const isDashboardOutside = dashboardRef.current && !dashboardRef.current.contains(target);
        const isNotificationOutside = notificationRef.current && !notificationRef.current.contains(target);

        if (isDashboardOutside) {
            setIsDashBoardOpen(false);
        }
        if (isNotificationOutside) {
            setIsNotificationOpen(false);
        }
    };

    const handleLogout = () => {
        logoutApi(loginState.email)
            .then(() => {
                dispatch(logout());
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
                {loginState.isLogin && (
                    <div ref={notificationRef}>
                        <div className='relative flex justify-around items-center w-full'>
                            <IconButton
                                icon={<MdNotificationsNone className='size-5' />}
                                onClick={handleNotificationDropDown}
                            />
                            <div
                                className={`${
                                    isNotificationOpen ? '' : 'hidden'
                                } absolute z-99 top-12 -right-12 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-72`}
                            >
                                <div className='py-1'>
                                    {notifications.map((notification, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {}}
                                            className='w-full block px-4 py-2 gap-y-2 text-start text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer'
                                        >
                                            <div className='flex flex-col gap-y-1'>
                                                <div className='font-semibold'>{notification.message}</div>
                                                <div className='font-normal'>
                                                    {relativeDateToKorean(notification.date)}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                    {notifications.length === 0 && (
                                        <div className='text-gray-500 text-center h-16 flex justify-center items-center'>
                                            알림이 없습니다.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {loginState.isLogin ? (
                    <div ref={dashboardRef}>
                        <div className='relative flex justify-around items-center w-full'>
                            <IconButton
                                icon={<ProfileImageCircle profileUrl={loginState.profileUrl} />}
                                onClick={handleDashBoardDropDown}
                            />
                            <div
                                className={`${
                                    isDashBoardOpen ? '' : 'hidden'
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
