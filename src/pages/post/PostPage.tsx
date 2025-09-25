import { Link, useNavigate, useParams } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout.tsx';
import DOMPurify from 'dompurify';
import { fullDateToKorean } from '../../common/util/date.tsx';
import TagCard from '../../components/post/TagCard.tsx';
import { getPost, getPostViewCount, incrementPostViewCount } from '../../common/apis/post.tsx';
import { ChangeEvent, useEffect, useState } from 'react';
import { PostResponse } from '../../common/types/post.tsx';
import { checkUUID } from '../../common/util/regex.tsx';
import { sortTagByName } from '../../common/util/sort.tsx';
import CommentCard from '../../components/post/CommentCard.tsx';
import CommentTextField from '../../components/post/CommentTextField.tsx';
import { FillButton, FillLink, LoadMoreButton } from '../../components/common/FillButton.tsx';
import { getComments, saveComment, updateComment } from '../../common/apis/comment.tsx';
import { CommentResponse, CommentType } from '../../common/types/comment.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import { PageResponse } from '../../common/types/common.tsx';
import { FaEye } from 'react-icons/fa6';
import { getProfileByUsername } from '../../common/apis/member.tsx';
import ProfileImageCircle from '../../components/common/ProfileImageCircle.tsx';
import { createSubscription, deleteSubscription, getIsSubscribed } from '../../common/apis/subscription.tsx';
import { createNotification } from '../../common/apis/notification.tsx';

function PostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const loginState = useSelector((state: RootState) => state.loginSlice);

    const [post, setPost] = useState<PostResponse>({
        id: '',
        title: '',
        content: '',
        username: '',
        tags: [],
        viewCount: 0,
        createdAt: new Date(),
    });
    const [postUser, setPostUser] = useState({
        imageUrl: '',
        isSubscribed: false,
        subscriptionId: '',
    });
    const [commentInput, setCommentInput] = useState('');
    const [comments, setComments] = useState<CommentType[]>([]);
    const [pageInfo, setPageInfo] = useState<PageResponse>({ number: 0, size: 10, totalPages: 0, totalElements: 0 });
    const [trigger, setTrigger] = useState(false);

    const handleCommentInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentInput(e.target.value);
    };
    const handleCommentSubmit = (
        parentCommentId: string | null,
        content: string,
        taggedUsername: string | null,
        originalComment: CommentType | null,
    ) => {
        if (originalComment) {
            handleUpdateComment(content, taggedUsername, originalComment);
            return;
        }

        if (parentCommentId !== null) {
            parentCommentId = findParentCommentId(comments, parentCommentId);
        }

        const commentRequest = {
            content: content,
            postId: post.id,
            parentCommentId: parentCommentId,
            taggedUsername: taggedUsername,
        };

        saveComment(commentRequest)
            .then(res => {
                if (loginState.username !== post.username) {
                    createNotification({
                        notificationType: 'COMMENT_CREATION',
                        dataId: res.data.id,
                    });
                }

                alert('등록되었습니다.');
                navigate(0);
            })
            .catch(error => alert(error.response.data.message));
    };
    const handleCommentRemove = (commentId: string) => {
        if (comments.findIndex(comment => comment.id === commentId) === -1) {
            setComments(prev =>
                prev.map(comment => ({
                    ...comment,
                    subComments: comment.subComments?.filter(subComment => subComment.id !== commentId) || [],
                })),
            );
        } else {
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        }
    };
    const findParentCommentId = (comments: CommentType[], parentCommentId: string) => {
        for (const comment of comments) {
            if (comment.id === parentCommentId) {
                return comment.id;
            }

            if (comment.subComments && comment.subComments.length > 0) {
                const foundId = findParentCommentId(comment.subComments, parentCommentId);
                if (foundId) {
                    return comment.id;
                }
            }
        }
        return null;
    };
    const handleUpdateComment = (
        content: string,
        taggedUsername: string | null,
        originalComment: CommentType | null,
    ) => {
        if (!originalComment) {
            alert('업데이트 할 댓글이 존재하지 않습니다.');
            return;
        }

        const commentUpdateRequest = {
            id: originalComment.id,
            content: content,
            taggedUsername: taggedUsername,
        };

        updateComment(commentUpdateRequest)
            .then(() => {
                alert('수정되었습니다.');
                setCommentInput('');
                setPageInfo({ ...pageInfo, number: 0 });
                getComments({
                    postId: post.id,
                    parentCommentId: null,
                    page: 0,
                    size: pageInfo.size,
                })
                    .then(res => {
                        setComments(getCommentType(res.data.content));
                        setPageInfo(res.data.page);
                    })
                    .catch(error => alert(error.response.data.message));
            })
            .catch(error => alert(error.response.data.message));
    };

    const handleLoadMoreComment = () => {
        setPageInfo({ ...pageInfo, number: pageInfo.number + 1 });
        setTrigger(prev => !prev);
    };
    const handleLoadMoreSubComment = (page: number, parentId: string) => {
        getComments({
            postId: post.id,
            parentCommentId: parentId,
            page: page,
            size: pageInfo.size,
        })
            .then(res => {
                setComments(prevComments =>
                    prevComments.map(comment => {
                        if (comment.id === parentId) {
                            return {
                                ...comment,
                                subComments: [...comment.subComments, ...res.data.content],
                            };
                        }
                        return comment;
                    }),
                );
            })
            .catch(error => alert(error.response.data.message));
    };

    useEffect(() => {
        if (id === null || id === undefined || !checkUUID(id)) {
            alert('올바르지 않은 주소입니다.');
            navigate(-1);
            return;
        }

        incrementPostViewCount(id);

        getPostViewCount(id).then(res => {
            setPost(prev => ({ ...prev, viewCount: res.data.viewCount }));
        });

        getPost(id)
            .then(res => {
                setPost(prev => ({
                    ...prev,
                    id: res.data.id,
                    title: res.data.title,
                    content: res.data.content,
                    username: res.data.username,
                    folder: res.data.folder,
                    tags: sortTagByName(res.data.tags),
                    createdAt: new Date(res.data.createdAt),
                }));
                setTrigger(prev => !prev);
            })
            .catch(error => alert(error.response.data.message));
    }, []);

    useEffect(() => {
        if (post.id === '') return;

        getProfileByUsername(post.username)
            .then(res => {
                setPostUser(prev => ({
                    ...prev,
                    imageUrl: res.data.profileUrl || '',
                }));
            })
            .catch(error => alert(error.response.data.message));

        getComments({
            postId: post.id,
            parentCommentId: null,
            page: pageInfo.number,
            size: pageInfo.size,
        })
            .then(res => {
                setComments(prev => [...prev, ...getCommentType(res.data.content)]);
                setPageInfo(res.data.page);
            })
            .catch(error => alert(error.response.data.message));
    }, [trigger]);

    useEffect(() => {
        if (loginState.isLogin && post.username !== '') {
            getIsSubscribed(post.username)
                .then(res => {
                    setPostUser(prev => ({
                        ...prev,
                        isSubscribed: res.data.hasSubscription,
                        subscriptionId: res.data.subscriptionId || '',
                    }));
                })
                .catch(error => alert(error.response.data.message));
        }
    }, [loginState.isLogin, post.username]);

    const handleSubscription = () => {
        if (!loginState.isLogin) {
            navigate('/login');
            return;
        }

        const notificationEnabled = confirm('해당 작가의 알림을 받으시겠습니까?');
        createSubscription({ authorName: post.username, notificationEnabled: notificationEnabled })
            .then(() => {
                getIsSubscribed(post.username)
                    .then(res => {
                        setPostUser(prev => ({
                            ...prev,
                            isSubscribed: res.data.hasSubscription,
                            subscriptionId: res.data.subscriptionId || '',
                        }));
                    })
                    .catch(error => alert(error.response.data.message));
                alert(`구독을 추가했습니다.`);
            })
            .catch(error => alert(error.response.data.message));
    };

    const handleDeleteSubscription = () => {
        deleteSubscription(postUser.subscriptionId)
            .then(() => {
                setPostUser(prev => ({ ...prev, isSubscribed: false }));
                alert('구독이 취소되었습니다.');
            })
            .catch(error => alert(error.response.data.message));
    };

    const getCommentType = (content: CommentResponse[]): CommentType[] => {
        return content.map(res => ({
            id: res.id,
            member: res.member,
            content: res.content,
            taggedUsername: res.taggedUsername,
            replyCount: res.replyCount,
            createdAt: res.createdAt,
            deleted: res.deleted,
            subComments: [],
        }));
    };

    const safeContent = DOMPurify.sanitize(post.content);

    return (
        <BasicLayout>
            <div className='w-full flex flex-col'>
                <div className='flex flex-col gap-y-8'>
                    <div className='flex justify-between items-center'>
                        <div className='flex-1 flex flex-wrap justify-center items-center gap-x-4'>
                            <Link to={`/blog/${post.username}`} className='text-xs'>
                                Home
                            </Link>
                            {post.folder && (
                                <div className='flex gap-x-4'>
                                    <div className='text-xs'>{` > `}</div>
                                    <Link to={`/blog/${post.username}?folder=${post.folder.id}`} className='text-xs'>
                                        {post.folder.title}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-row flex-wrap w-full justify-center text-center items-center gap-4'>
                        <Link
                            to={`/blog/${post.username}`}
                            className='text-md font-semibold text-lime-700 hover:text-lime-400'
                        >
                            {post.username}
                        </Link>
                        <div className='text-md text-gray-600'>{fullDateToKorean(post.createdAt)}</div>
                    </div>
                    <div className='text-center leading-relaxed text-3xl text-gray-900 font-jalnan break-words'>
                        {post.title}
                    </div>
                    <div className='flex flex-wrap justify-center items-center gap-4'>
                        {post.tags.map(tag => (
                            <TagCard
                                key={tag.id}
                                tag={tag}
                                onClick={() => {
                                    navigate(
                                        `/search?keyword=${tag.name}&option=TAG&sort=createdAt&isDescending=true&tab=post`,
                                    );
                                }}
                            />
                        ))}
                    </div>
                    <div className='w-full max-w-3xl mx-auto flex justify-end items-center gap-x-2 text-gray-600'>
                        <FaEye />
                        {post.viewCount}
                    </div>
                </div>
                <div
                    className='w-full max-w-3xl mx-auto py-8 space-y-4 break-words'
                    dangerouslySetInnerHTML={{ __html: safeContent }}
                />
                <div className='w-full max-w-3xl mx-auto px-4 py-8 flex justify-between items-center border-b border-gray-300'>
                    <button
                        onClick={() => navigate(`/blog/${post.username}`)}
                        className='flex items-center gap-x-6 hover:text-lime-600 hover:cursor-pointer'
                    >
                        <ProfileImageCircle profileUrl={postUser.imageUrl} size='md' />
                        <div className='font-bold text-xl'>{post.username}</div>
                    </button>
                    {loginState.username !== post.username &&
                        (postUser.isSubscribed ? (
                            <FillButton
                                text='구독 취소'
                                onClick={handleDeleteSubscription}
                                addStyle='bg-red-400 hover:bg-red-700'
                            />
                        ) : (
                            <FillButton text='구독' onClick={handleSubscription} />
                        ))}
                </div>
                <div className='w-full max-w-3xl mx-auto py-8 rounded-2xl flex flex-col gap-y-0 my-8'>
                    {loginState.isLogin ? (
                        <CommentTextField
                            value={commentInput}
                            onChange={handleCommentInput}
                            handleSubmit={handleCommentSubmit}
                        />
                    ) : (
                        <div className='flex flex-col items-end gap-y-2'>
                            <textarea
                                className='w-full border border-gray-400 bg-gray-100 opacity-50'
                                disabled={true}
                                rows={5}
                                minLength={5}
                            />
                            <FillLink text={'로그인'} to={'/login'} addStyle={'w-fit'} />
                        </div>
                    )}
                    <p>댓글 ({comments.length})</p>
                    {comments.map((comment, i) => (
                        <CommentCard
                            key={i}
                            comment={comment}
                            handleLoadMoreSubComment={handleLoadMoreSubComment}
                            handleCommentSubmit={handleCommentSubmit}
                            handleCommentRemove={handleCommentRemove}
                            pageSize={pageInfo.size}
                        />
                    ))}
                    {pageInfo.number + 1 < pageInfo.totalPages && (
                        <LoadMoreButton onClick={handleLoadMoreComment} addStyle={'!bg-gray-400'} />
                    )}
                </div>
            </div>
        </BasicLayout>
    );
}

export default PostPage;
