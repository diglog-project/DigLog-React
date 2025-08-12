import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import { MdOutlineEdit } from 'react-icons/md';
import { ChangeEvent, useRef, useState } from 'react';
import { FillButton } from '../../components/common/FillButton.tsx';
import { setUsername } from '../../common/slices/loginSlice.tsx';
import { TextButton } from '../../components/common/TextButton.tsx';
import { updateProfileImage, updateUsername } from '../../common/apis/member.tsx';
import { useNavigate } from 'react-router-dom';
import ProfileImageCircle from '../../components/common/ProfileImageCircle.tsx';

function ProfileSettingPage() {
    const navigate = useNavigate();
    const loginState = useSelector((state: RootState) => state.loginSlice);
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [input, setInput] = useState(loginState.username);
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isUsernameEdit, setIsUsernameEdit] = useState(false);
    const [isImageEdit, setIsImageEdit] = useState(false);

    const handleUsernameEdit = () => {
        setIsUsernameEdit(true);
    };

    const handleUsernameEditCancel = () => {
        setIsUsernameEdit(false);
    };

    const handleUsernameSubmit = () => {
        updateUsername(input)
            .then(() => {
                alert('변경되었습니다.');
                dispatch(
                    setUsername({
                        username: input,
                    }),
                );
                setIsUsernameEdit(false);
            })
            .catch(error => alert(error.response.data.message))
            .finally(() => {});
    };

    const handleImageEdit = () => {
        setIsImageEdit(true);
        fileInputRef.current!.click();
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleImageEditCancel = () => {
        setIsImageEdit(false);
    };

    const handleImageSubmit = () => {
        if (!file) {
            alert('업데이트할 이미지를 선택해주세요.');
            return;
        }

        updateProfileImage(file)
            .then(() => {
                alert('변경되었습니다.');
                navigate(0);
            })
            .catch(error => alert(error.response.data.message));
    };

    return (
        <div>
            <p className='font-semibold text-xl my-4'>프로필 관리</p>
            <div className='border border-gray-200 rounded-2xl p-16 flex flex-col justify-start items-center py-4 gap-4 z-200'>
                <div className='flex justify-center items-center gap-x-4'>
                    <div className={`${isImageEdit ? 'w-36' : 'w-0'}`} />
                    <div className='relative group'>
                        {isImageEdit && image ? (
                            <img
                                className='border border-gray-300 size-32 rounded-full group-hover:brightness-50'
                                src={image}
                                alt='Edit Profile Image'
                            />
                        ) : (
                            <ProfileImageCircle
                                profileUrl={loginState.profileUrl}
                                size='lg'
                                addStyle='!border-gray-300 group-hover:brightness-50 border !size-32'
                            />
                        )}
                        <div
                            className={`${
                                !loginState.profileUrl && 'top-1 left-1'
                            } absolute size-32 inset-0 flex justify-center items-center`}
                        >
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                hidden
                            />
                            <MdOutlineEdit
                                className='size-10 p-1 opacity-0 rounded-full border bg-white group-hover:opacity-100 hover:brightness-50 hover:cursor-pointer'
                                onClick={handleImageEdit}
                            ></MdOutlineEdit>
                        </div>
                    </div>
                    {isImageEdit && (
                        <div className='w-32 flex justify-center items-center'>
                            <TextButton text={'취소'} onClick={handleImageEditCancel} />
                            <FillButton text={'변경'} onClick={handleImageSubmit} />
                        </div>
                    )}
                </div>
                <div className='flex justify-center items-center gap-x-4 text-2xl font-black'>
                    {isUsernameEdit ? (
                        <div className='flex justify-between items-center gap-x-4'>
                            <input
                                className='text-sm p-4'
                                type='text'
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder='Username'
                            />
                            <TextButton
                                text={'취소'}
                                onClick={handleUsernameEditCancel}
                                addStyle={'w-20 text-sm font-normal'}
                            />
                            <FillButton
                                text={'변경'}
                                onClick={handleUsernameSubmit}
                                addStyle={'w-20 text-sm font-normal'}
                            />
                        </div>
                    ) : (
                        <div className='flex justify-center items-center gap-x-4'>
                            <div className='w-12' />
                            <p className='text-center'>{loginState.username}</p>
                            <button
                                className='w-12 hover:cursor-pointer hover:text-gray-600'
                                onClick={handleUsernameEdit}
                            >
                                <MdOutlineEdit />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileSettingPage;
