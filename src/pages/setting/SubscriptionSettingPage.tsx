import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';

function SubscriptionSettingPage() {
    const navigate = useNavigate();
    const loginState = useSelector((state: RootState) => state.loginSlice);

    useEffect(() => {
        if (loginState.isReloaded) {
            return;
        }
        if (!loginState.isLogin) {
            alert('로그인이 필요한 페이지입니다.');
            navigate('/login');
        }
    }, [loginState.isReloaded, loginState.isLogin]);

    return (
        <div>
            <p className='font-semibold text-xl my-4'>구독 관리</p>
            <div className='border border-gray-200 rounded-2xl p-16 flex flex-col justify-start items-center py-4 gap-4 z-200'>
                구독 관리 페이지
            </div>
        </div>
    );
}

export default SubscriptionSettingPage;
