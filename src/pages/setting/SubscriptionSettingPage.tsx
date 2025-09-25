import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { SubscriberResponse, SubscriptionResponse } from '../../common/types/subscription';
import {
    getSubscriberList,
    getSubscriptionList,
    updateSubscriptionNotification,
    deleteSubscription,
} from '../../common/apis/subscription';
import PaginationButton from '../../components/common/PaginationButton';

function SubscriptionSettingPage() {
    const navigate = useNavigate();
    const loginState = useSelector((state: RootState) => state.loginSlice);

    const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
    const [subscribers, setSubscribers] = useState<SubscriberResponse[]>([]);
    const [subscriptionPageInfo, setSubscriptionPageInfo] = useState({
        number: 0,
        size: 8,
        totalElements: 0,
        totalPages: 0,
    });
    const [subscriberPageInfo, setSubscriberPageInfo] = useState({
        number: 0,
        size: 8,
        totalElements: 0,
        totalPages: 0,
    });
    const [tab, setTab] = useState<'subscriptions' | 'subscribers'>('subscriptions');

    useEffect(() => {
        if (loginState.isReloaded) {
            return;
        }
        if (!loginState.isLogin) {
            alert('로그인이 필요한 페이지입니다.');
            navigate('/login');
        }

        getSubscriptionList({ authorName: loginState.username, page: 0, size: 100 }).then(res => {
            setSubscriptions(res.data.content);
            setSubscriptionPageInfo(res.data.page);
        });
        getSubscriberList({ subscriberName: loginState.username, page: 0, size: 100 }).then(res => {
            setSubscribers(res.data.content);
            setSubscriberPageInfo(res.data.page);
        });
    }, [loginState.isReloaded, loginState.isLogin]);

    useEffect(() => {
        if (tab === 'subscriptions') {
            getSubscriptionList({
                authorName: loginState.username,
                page: subscriptionPageInfo.number,
                size: subscriptionPageInfo.size,
            }).then(res => {
                setSubscriptions(res.data.content);
                setSubscriptionPageInfo(res.data.page);
            });
        } else {
            getSubscriberList({
                subscriberName: loginState.username,
                page: subscriberPageInfo.number,
                size: subscriberPageInfo.size,
            }).then(res => {
                setSubscribers(res.data.content);
                setSubscriberPageInfo(res.data.page);
            });
        }
    }, [tab]);

    const handleNotificationToggle = async (
        subscriptionId: string,
        notificationEnabled: boolean,
        e: React.MouseEvent,
    ) => {
        e.stopPropagation(); // 카드 클릭 이벤트 방지

        try {
            await updateSubscriptionNotification(subscriptionId, !notificationEnabled);

            // 구독 목록의 알림 설정 업데이트
            if (tab === 'subscriptions') {
                setSubscriptions(prev =>
                    prev.map(sub =>
                        sub.subscriptionId === subscriptionId
                            ? { ...sub, notificationEnabled: !sub.notificationEnabled }
                            : sub,
                    ),
                );
            }
        } catch (error) {
            console.error('Failed to update notification setting:', error);
            alert('알림 설정 변경에 실패했습니다.');
        }
    };

    const handleSetSubscriptionPage = (page: number) => {
        getSubscriptionList({ authorName: loginState.username, page, size: subscriptionPageInfo.size }).then(res => {
            setSubscriptions(res.data.content);
            setSubscriptionPageInfo(res.data.page);
        });
    };

    const handleUnsubscribe = async (subscriptionId: string, username: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm(`${username}님의 구독을 취소하시겠습니까?`)) {
            return;
        }

        try {
            await deleteSubscription(subscriptionId);
            alert('구독이 취소되었습니다.');

            // 현재 페이지 데이터 새로고침
            getSubscriptionList({
                authorName: loginState.username,
                page: subscriptionPageInfo.number,
                size: subscriptionPageInfo.size,
            }).then(res => {
                setSubscriptions(res.data.content);
                setSubscriptionPageInfo(res.data.page);
            });
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
            alert('구독 취소에 실패했습니다.');
        }
    };

    const renderTabContent = () => {
        if (tab === 'subscriptions') {
            return (
                <div>
                    {subscriptions.length === 0 ? (
                        <div className='text-center py-8 text-gray-500'>구독한 블로그가 없습니다.</div>
                    ) : (
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            {subscriptions.map(subscription => (
                                <div
                                    key={subscription.subscriptionId}
                                    className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors'
                                    onClick={() => navigate(`/blog/${subscription.authorName}`)}
                                >
                                    <div className='flex-1'>
                                        <p className='font-medium'>{subscription.authorName}</p>
                                        <p className='text-sm text-gray-500'>
                                            {new Date(subscription.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <button
                                            onClick={e =>
                                                handleNotificationToggle(
                                                    subscription.subscriptionId,
                                                    subscription.notificationEnabled,
                                                    e,
                                                )
                                            }
                                            className={`px-2 py-1 text-xs rounded-full transition-colors cursor-pointer hover:opacity-75 ${
                                                subscription.notificationEnabled
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        >
                                            {subscription.notificationEnabled ? '알림 ON' : '알림 OFF'}
                                        </button>
                                        <button
                                            onClick={e =>
                                                handleUnsubscribe(
                                                    subscription.subscriptionId,
                                                    subscription.authorName,
                                                    e,
                                                )
                                            }
                                            className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 transition-colors'
                                        >
                                            구독 취소
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className='mt-6 flex justify-center'>
                        <PaginationButton pageInfo={subscriptionPageInfo} setPage={handleSetSubscriptionPage} />
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {subscribers.length === 0 ? (
                        <div className='text-center py-8 text-gray-500'>팔로워가 없습니다.</div>
                    ) : (
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            {subscribers.map(subscriber => (
                                <div
                                    key={subscriber.subscriptionId}
                                    className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors'
                                    onClick={() => navigate(`/blog/${subscriber.subscriberName}`)}
                                >
                                    <div className='flex-1'>
                                        <p className='font-medium'>{subscriber.subscriberName}</p>
                                        <p className='text-sm text-gray-500'>
                                            {new Date(subscriber.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className='mt-6 flex justify-center'>
                        <PaginationButton pageInfo={subscriptionPageInfo} setPage={handleSetSubscriptionPage} />
                    </div>
                </div>
            );
        }
    };

    return (
        <div>
            <p className='font-semibold text-xl my-4'>구독 관리</p>
            <div className='border border-gray-200 rounded-2xl p-6'>
                {/* Tab Header */}
                <div className='flex border-b border-gray-200 mb-6'>
                    <button
                        onClick={() => setTab('subscriptions')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                            tab === 'subscriptions'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        구독 목록 ({subscriptions.length})
                    </button>
                    <button
                        onClick={() => setTab('subscribers')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                            tab === 'subscribers'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        팔로워 목록 ({subscribers.length})
                    </button>
                </div>

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </div>
    );
}

export default SubscriptionSettingPage;
