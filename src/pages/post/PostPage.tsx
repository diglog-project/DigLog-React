import {Link, useNavigate, useParams} from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout.tsx";
import DOMPurify from "dompurify";
import {fullDateToKorean} from "../../common/util/date.tsx";
import TagCard from "../../components/post/TagCard.tsx";
import {getPost} from "../../common/apis/post.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {PostResponse} from "../../common/types/post.tsx";
import {checkUUID} from "../../common/util/regex.tsx";
import {sortTagByName} from "../../common/util/sort.tsx";
import CommentCard from "../../components/post/CommentCard.tsx";
import CommentTextField from "../../components/post/CommentTextField.tsx";
import {FillLink, LoadMoreButton} from "../../components/common/FillButton.tsx";
import {getComments, saveComment, updateComment} from "../../common/apis/comment.tsx";
import {CommentResponse, CommentType} from "../../common/types/comment.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";

function PostPage() {

    const {id} = useParams();
    const navigate = useNavigate();
    const loginState = useSelector((state: RootState) => state.loginSlice);

    const pageSize = 10;

    const [post, setPost] = useState<PostResponse>({
        id: "",
        title: "",
        content: "",
        username: "",
        tags: [],
        createdAt: new Date(),
    });
    const [commentInput, setCommentInput] = useState("");
    const [comments, setComments] = useState<CommentType[]>([]);
    const [pageInfo, setPageInfo] = useState({number: 0, totalPages: 0});
    const [trigger, setTrigger] = useState(false);

    const handleCommentInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentInput(e.target.value);
    }
    const handleCommentSubmit = (parentCommentId: string | null, content: string, taggedUsername: string | null, originalComment: CommentType | null) => {
        if (originalComment) {
            handleUpdateComment(content, taggedUsername, originalComment);
            return;
        }

        if (!confirm("댓글을 등록하시겠습니까?")) {
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
            .then(() => {
                alert("등록되었습니다.");
                navigate(0);
            })
            .catch((error) => alert(error.response.data.message));
    }
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
    }
    const handleUpdateComment = (content: string, taggedUsername: string | null, originalComment: CommentType | null) => {
        if (!confirm("댓글을 수정하시겠습니까?")) {
            return;
        }

        if (!originalComment) {
            alert("업데이트 할 댓글이 존재하지 않습니다.");
            return;
        }

        const commentUpdateRequest = {
            id: originalComment.id,
            content: content,
            taggedUsername: taggedUsername,
        };

        updateComment(commentUpdateRequest)
            .then(() => {
                alert("수정되었습니다.");
                navigate(0);
            })
            .catch((error) => alert(error.response.data.message));
    }

    const handleLoadMoreComment = () => {
        setPageInfo({...pageInfo, number: pageInfo.number + 1});
        setTrigger(prev => !prev);
    }
    const handleLoadMoreSubComment = (page: number, parentId: string) => {
        getComments({
            postId: post.id,
            parentCommentId: parentId,
            page: page,
            size: pageSize,
        })
            .then((res) => {
                setComments(prevComments =>
                    prevComments.map(comment => {
                        if (comment.id === parentId) {
                            return {
                                ...comment,
                                subComments: [...comment.subComments, ...res.data.content]
                            }
                        }
                        return comment;
                    }));
            })
            .catch((error) => alert(error.response.data.message));
    }

    useEffect(() => {
        if (id === null || id === undefined || !checkUUID(id)) {
            alert("올바르지 않은 주소입니다.");
            navigate(-1);
            return;
        }

        getPost(id)
            .then((res) => {
                setPost({
                    ...res.data,
                    id: id,
                    tags: sortTagByName(res.data.tags),
                    createdAt: new Date(),
                });
                setTrigger(prev => !prev);
            })
            .catch((error) => alert(error.response.data.message));
    }, []);

    useEffect(() => {
        if (post.id === "") return;

        getComments({
            postId: post.id,
            parentCommentId: null,
            page: pageInfo.number,
            size: pageSize,
        })
            .then((res) => {
                setComments(prev => [...prev, ...getCommentType(res.data.content)]);
                setPageInfo({number: pageInfo.number, totalPages: res.data.page.totalPages});
            })
            .catch((error) => alert(error.response.data.message));
    }, [trigger]);

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
    }

    const safeContent = DOMPurify.sanitize(post.content);

    return (
        <BasicLayout>
            <div className="w-full flex flex-col">
                <div className="flex flex-col gap-y-8">
                    <div className="flex justify-between items-center">
                        <div className="flex-1 flex justify-center items-center gap-x-4">
                            <Link to={`/blog/${post.username}`} className="text-xs">Home</Link>
                            <div className="text-xs">{` > `}</div>
                            <Link to={`/blog/${post.username}?folder=폴더`} className="text-xs">폴더</Link>
                            <div>{` > `}</div>
                            <div className="text-xs text-gray-600 max-w-96 md:max-w-192 break-words">{post.title}</div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full justify-center text-center items-center gap-4">
                        <Link to={`/blog/${post.username}`}
                              className="text-md font-semibold text-lime-700 hover:text-lime-400">
                            {post.username}
                        </Link>
                        <div className="text-md text-gray-600">
                            {fullDateToKorean(post.createdAt)}
                        </div>
                    </div>
                    <div className="text-center leading-relaxed text-4xl text-gray-900 font-jalnan break-words">
                        {post.title}
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {post.tags.map(tag =>
                            <TagCard key={tag.id} tag={tag} onClick={() => {
                                navigate(`/search?word=${tag.name}&option=태그`)
                            }}/>)}
                    </div>
                </div>
                <div className="w-4xl mx-auto p-8 break-words"
                     dangerouslySetInnerHTML={{__html: safeContent}}/>
                <div className="w-full max-w-4xl mx-auto p-8 rounded-2xl flex flex-col gap-y-0 my-8">
                    <p>댓글</p>

                    {loginState.isLogin
                        ? <CommentTextField
                            value={commentInput}
                            onChange={handleCommentInput}
                            handleSubmit={handleCommentSubmit}/>
                        : <div className="flex flex-col items-end gap-y-2">
                            <textarea className="w-full border border-gray-400 bg-gray-100 opacity-50"
                                      disabled={true}
                                      rows={5}
                                      minLength={5}/>
                            <FillLink text={"로그인"} to={"/login"} addStyle={"w-fit"}/>
                        </div>
                    }
                    {comments.map((comment, i) =>
                        <CommentCard
                            key={i}
                            comment={comment}
                            handleLoadMoreSubComment={handleLoadMoreSubComment}
                            handleCommentSubmit={handleCommentSubmit}
                            pageSize={pageSize}/>)}
                    {pageInfo.number + 1 < pageInfo.totalPages &&
                        <LoadMoreButton
                            onClick={handleLoadMoreComment}
                            addStyle={"!bg-gray-400"}/>}
                </div>

            </div>
        </BasicLayout>
    )
        ;
}

export default PostPage;