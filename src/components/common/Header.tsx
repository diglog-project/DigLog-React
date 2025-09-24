import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import { useEffect, useRef, useState } from 'react';
import { TextLink } from './TextButton.tsx';
import { MdNotificationsNone, MdOutlineSearch, MdArrowForward } from 'react-icons/md';
import IconButton from './IconButton.tsx';
import { getProfile, logoutApi } from '../../common/apis/member.tsx';
import { logout, setProfile, setReloadedFalse } from '../../common/slices/loginSlice.tsx';
import ProfileImageCircle from './ProfileImageCircle.tsx';
import { NotificationResponse } from '../../common/types/notification.tsx';
import { Event, EventSourcePolyfill } from 'event-source-polyfill';
import { relativeDateToKorean } from '../../common/util/date.tsx';
import {
    getNotificationList,
    readNotification,
    readAllNotifications,
    removeNotification,
    getUnreadNotificationCount,
} from '../../common/apis/notification.tsx';
import {
    addCount,
    resetCount,
    setCount,
    setMessage,
    setSseConnected,
    setTrigger,
    subtractCount,
} from '../../common/slices/sseSlice.tsx';
import PaginationButton from './PaginationButton.tsx';

function Header() {
    const dispatch = useDispatch();
    const loginState = useSelector((state: RootState) => state.loginSlice);
    const sseState = useSelector((state: RootState) => state.sseSlice);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [pageInfo, setPageInfo] = useState({ number: 0, size: 4, totalElements: 0, totalPages: 0 });

    const handleNotificationClick = async (notification: NotificationResponse) => {
        if (!notification.isRead) {
            try {
                await readNotification(notification.notificationId);
                setNotifications(prev =>
                    prev.map(n => (n.notificationId === notification.notificationId ? { ...n, isRead: true } : n)),
                );
                dispatch(subtractCount());
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        }
    };

    const handleReadAllNotifications = async () => {
        try {
            await readAllNotifications();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            dispatch(resetCount());
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleDeleteAllNotifications = async () => {
        if (!confirm('해당 페이지의 알림을 모두 삭제하시겠습니까?')) {
            return;
        }

        try {
            const notificationIds = notifications.map(n => n.notificationId);
            if (notificationIds.length > 0) {
                await removeNotification(notificationIds);
                alert('알림이 삭제되었습니다.');

                getNotificationList({ page: 0, size: pageInfo.size }).then(res => {
                    setNotifications(res.data.content);
                });
            }
        } catch (error) {
            console.error('Failed to delete notifications:', error);
        }
    };

    const dashboardRef = useRef<HTMLDivElement | null>(null);
    const [isDashBoardOpen, setIsDashBoardOpen] = useState(false);

    const notificationRef = useRef<HTMLDivElement | null>(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

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
        if (!loginState.isLogin) {
            return;
        }

        getUnreadNotificationCount()
            .then(res => {
                dispatch(setCount({ count: res.data.unreadCount }));
            })
            .catch(() => {
                alert('알림 개수를 불러오지 못했습니다.');
            });
    }, [loginState.isLogin, dispatch]);

    useEffect(() => {
        if (!loginState.isLogin) {
            dispatch(setSseConnected({ sseConnected: false }));
            return;
        }

        if (sseState.sseConnected) {
            return;
        }

        const connect = () => {
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
                dispatch(setMessage({ message: messageEvent.data }));
                dispatch(addCount());
                dispatch(setTrigger());
            });

            eventSource.addEventListener('connect', (res: Event) => {
                const messageEvent = res as MessageEvent;
                console.log('SSE Message: ' + messageEvent.data);
                dispatch(setSseConnected({ sseConnected: true }));
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
                        clearInterval(connectionCheckInterval);
                        eventSource.close();
                        return 'disconnected';
                    default:
                        return 'unknown';
                }
            }

            // 주기적으로 상태 확인
            const connectionCheckInterval = setInterval(() => {
                console.log('현재 SSE 상태:', checkConnectionStatus());
            }, 3000);
        };

        return connect();
    }, [loginState.isLogin, loginState.accessToken, sseState.sseConnected, dispatch]);

    // SSE 메시지 표시 관리
    useEffect(() => {
        if (sseState.message && sseState.message !== '') {
            setShowMessage(true);

            // 5초 후 자동으로 숨김
            const timer = setTimeout(() => {
                setShowMessage(false);
                dispatch(setMessage({ message: '' }));
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [sseState.message]);

    const handleDashBoardDropDown = () => {
        setIsDashBoardOpen(cur => !cur);
        setIsNotificationOpen(false);
    };

    const handleNotificationDropDown = () => {
        getNotificationList({ page: 0, size: pageInfo.size })
            .then(res => {
                setNotifications(res.data.content);
                setPageInfo(res.data.page);
            })
            .catch(() => {
                setNotifications([]);
            });

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

    const setPage = (newPage: number) => {
        getNotificationList({ page: newPage, size: pageInfo.size })
            .then(res => {
                setNotifications(res.data.content);
                setPageInfo(res.data.page);
            })
            .catch(() => {
                setNotifications([]);
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
                            <div className='relative'>
                                <IconButton
                                    icon={<MdNotificationsNone className='size-5' />}
                                    onClick={handleNotificationDropDown}
                                />
                                {sseState.messageCount > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
                                        {sseState.messageCount > 9 ? '9+' : sseState.messageCount}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`${
                                    isNotificationOpen ? '' : 'hidden'
                                } absolute z-99 top-12 -right-12 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-72`}
                            >
                                <div className='pl-4 pr-2 -my-1 border-b border-gray-100 flex justify-between items-center'>
                                    <h3 className='text-sm font-semibold text-gray-900'>알림</h3>
                                    <button
                                        onClick={() => navigate('/setting/notification')}
                                        className='p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'
                                        title='모든 알림 보기'
                                    >
                                        <MdArrowForward className='w-4 h-4 text-gray-600' />
                                    </button>
                                </div>
                                <div className='py-1'>
                                    {notifications.map((notification, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`w-full block px-4 py-2 gap-y-2 text-start text-sm hover:bg-gray-100 hover:cursor-pointer ${
                                                notification.isRead
                                                    ? 'text-gray-500 bg-gray-50'
                                                    : 'text-gray-700 bg-white'
                                            }`}
                                        >
                                            <div className='flex items-start gap-x-3'>
                                                <div className='flex flex-col gap-y-1 flex-1'>
                                                    <div
                                                        className={`${
                                                            notification.isRead ? 'font-normal' : 'font-semibold'
                                                        }`}
                                                    >
                                                        {notification.message}
                                                    </div>
                                                    <div className='font-normal text-xs'>
                                                        {relativeDateToKorean(notification.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                    {notifications.length === 0 && (
                                        <div className='text-gray-500 text-center h-16 flex justify-center items-center'>
                                            알림이 없습니다.
                                        </div>
                                    )}
                                    <div className='bg-gray-50'>
                                        <PaginationButton pageInfo={pageInfo} setPage={setPage} />
                                    </div>
                                    <div className='border-t border-gray-100'>
                                        <div className='flex'>
                                            <button
                                                className='flex-1 px-4 py-2 text-center text-xs text-gray-700 bg-blue-50 hover:bg-blue-100 hover:cursor-pointer'
                                                onClick={handleReadAllNotifications}
                                                disabled={
                                                    notifications.length === 0 || notifications.every(n => n.isRead)
                                                }
                                            >
                                                모든 알림 읽기
                                            </button>
                                            <button
                                                className='flex-1 px-4 py-2 text-center text-xs text-gray-700 bg-red-50 hover:bg-red-100 hover:cursor-pointer'
                                                onClick={handleDeleteAllNotifications}
                                                disabled={notifications.length === 0}
                                            >
                                                알림 모두 삭제
                                            </button>
                                        </div>
                                    </div>
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

            {/* SSE 메시지 알림 */}
            {showMessage && sseState.message && (
                <div className='fixed bottom-4 right-4 bg-lime-800 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm z-50 animate-fade-in'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <div className='mr-2'>🔔</div>
                            <div>{sseState.message}</div>
                        </div>
                        <button
                            onClick={() => setShowMessage(false)}
                            className='ml-3 text-white hover:text-gray-200 cursor-pointer'
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
