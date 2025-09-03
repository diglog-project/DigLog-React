import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NotificationResponse } from '../../common/types/notification';
import {
    getNotificationList,
    readAllNotifications,
    readNotification,
    removeNotification,
} from '../../common/apis/notification';
import { PageResponse } from '../../common/types/common';
import { fullDateToKorean } from '../../common/util/date';
import { FillButton } from '../../components/common/FillButton';
import PaginationButton from '../../components/common/PaginationButton';

function NotificationSettingPage() {
    const navigate = useNavigate();
    const loginState = useSelector((state: RootState) => state.loginSlice);

    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [pageInfo, setPageInfo] = useState<PageResponse>({
        number: 0,
        size: 6,
        totalElements: 0,
        totalPages: 0,
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

    useEffect(() => {
        if (loginState.isReloaded) {
            return;
        }
        if (!loginState.isLogin) {
            alert('로그인이 필요한 페이지입니다.');
            navigate('/login');
        }

        getNotificationList({
            page: pageInfo.number,
            size: pageInfo.size,
        })
            .then(res => {
                setNotifications(res.data.content);
                setPageInfo(res.data.page);
            })
            .catch(error => {
                alert(error.response?.data?.message || '알림 목록을 불러오지 못했습니다.');
            });
    }, [loginState.isReloaded, loginState.isLogin, pageInfo.number, trigger]);

    const handleReadAll = () => {
        if (!confirm('모든 알림을 읽음 처리하시겠습니까?')) {
            return;
        }

        readAllNotifications()
            .then(() => {
                alert('모든 알림을 읽음 처리했습니다.');
            })
            .catch(error => {
                alert(error.response?.data?.message || '알림 읽음 처리에 실패했습니다.');
            });

        setTrigger(prev => !prev);
    };

    const handleToggleNotification = (notificationId: string) => {
        setSelectedNotifications(prev =>
            prev.includes(notificationId) ? prev.filter(id => id !== notificationId) : [...prev, notificationId],
        );
    };

    const handleToggleAllNotifications = () => {
        if (notifications.every(n => selectedNotifications.includes(n.notificationId))) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(prev => [...prev, ...notifications.map(n => n.notificationId)]);
        }
    };

    const handleDeleteSelectedNotifications = () => {
        if (selectedNotifications.length === 0) {
            alert('삭제할 알림을 선택해주세요.');
            return;
        }
        handleRemoveNotification(selectedNotifications);
        setSelectedNotifications([]);
    };

    const handleReadNotification = (notificationId: string) => {
        readNotification(notificationId)
            .then(() => {
                setTrigger(prev => !prev);
            })
            .catch(error => {
                alert(error.response?.data?.message || '알림 읽음 처리에 실패했습니다.');
            });
    };

    const handleRemoveNotification = (notificationIds: string[]) => {
        if (!confirm('선택한 알림을 삭제하시겠습니까?')) {
            return;
        }

        removeNotification(notificationIds)
            .then(() => {
                alert('알림을 삭제했습니다.');
                handleEditMode();
                setPageInfo(prev => ({ ...prev, number: 0 }));
                setTrigger(prev => !prev);
            })
            .catch(error => {
                alert(error.response?.data?.message || '알림 삭제에 실패했습니다.');
            });
    };

    const handleEditMode = () => {
        setIsEditMode(prev => !prev);
        setSelectedNotifications([]);
    };

    const setPage = (page: number) => {
        setPageInfo(prev => ({ ...prev, number: page }));
    };

    return (
        <div>
            {!isEditMode ? (
                <div className='flex justify-between items-center'>
                    <p className='font-semibold text-xl my-4'>알림 관리</p>
                    <div className='flex gap-x-2'>
                        <FillButton text={'모두 읽음 처리'} onClick={handleReadAll} />
                        <FillButton text={'알림 관리'} onClick={handleEditMode} addStyle='!bg-green-400' />
                    </div>
                </div>
            ) : (
                <div className='flex justify-between items-center'>
                    <p className='font-semibold text-xl my-4'>알림 관리</p>
                    <div className='flex gap-x-2'>
                        <FillButton text={'취소'} onClick={handleEditMode} />
                        <FillButton
                            text={'선택 알림 삭제'}
                            onClick={handleDeleteSelectedNotifications}
                            addStyle='bg-red-500'
                        />
                    </div>
                </div>
            )}
            {isEditMode && notifications.length > 0 && (
                <div className='flex justify-end items-center gap-2 mr-1 mb-4 p-3 bg-gray-50 rounded-lg'>
                    <label htmlFor='selectAll' className='text-sm text-gray-700 cursor-pointer'>
                        페이지 전체 선택
                    </label>
                    <input
                        type='checkbox'
                        id='selectAll'
                        checked={
                            notifications.length > 0 &&
                            notifications.every(n => selectedNotifications.includes(n.notificationId))
                        }
                        onChange={handleToggleAllNotifications}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                    />
                </div>
            )}
            <div className='space-y-3 my-4'>
                {notifications.map(notification => (
                    <div
                        key={notification.notificationId}
                        className={`relative bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 ${
                            !notification.isRead ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200'
                        }`}
                    >
                        {/* 읽지 않은 알림 인디케이터 */}
                        {!notification.isRead && (
                            <div className='absolute -top-2 -right-2 size-4 bg-blue-500 rounded-full'></div>
                        )}

                        <div className='flex items-start gap-3'>
                            <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                    notification.notificationType === 'COMMENT_CREATION'
                                        ? 'bg-green-100 text-green-600'
                                        : notification.notificationType === 'POST_CREATION'
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-blue-100 text-blue-600'
                                }`}
                            >
                                {notification.notificationType === 'COMMENT_CREATION' && '💬'}
                                {notification.notificationType === 'POST_CREATION' && '🔔'}
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p
                                    className={`text-sm leading-relaxed ${
                                        !notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-700'
                                    }`}
                                >
                                    {notification.message}
                                </p>

                                <p className='text-xs text-gray-500 mt-1'>{fullDateToKorean(notification.createdAt)}</p>
                            </div>

                            <div className='flex flex-col gap-2 lg:flex-row lg:items-end'>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleReadNotification(notification.notificationId)}
                                        className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 cursor-pointer`}
                                    >
                                        읽음 처리
                                    </button>
                                )}
                                {!isEditMode ? (
                                    <button
                                        onClick={() => handleRemoveNotification([notification.notificationId])}
                                        className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 cursor-pointer`}
                                    >
                                        삭제
                                    </button>
                                ) : (
                                    <input
                                        type='checkbox'
                                        checked={selectedNotifications.includes(notification.notificationId)}
                                        onChange={() => handleToggleNotification(notification.notificationId)}
                                        className='flex-shrink-0 w-4 h-4 mt-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <PaginationButton pageInfo={pageInfo} setPage={setPage} />
        </div>
    );
}

export default NotificationSettingPage;
