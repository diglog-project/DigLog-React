import {fullDateToKorean} from "../../common/util/date.tsx";
import {MdOutlineAddComment, MdOutlineComment, MdOutlinePerson} from "react-icons/md";
import {ChangeEvent, useState} from "react";
import CommentTextField from "./CommentTextField.tsx";
import {CommentType} from "../../common/types/comment.tsx";
import {LoadMoreButton} from "../common/FillButton.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";
import {TextButton} from "../common/TextButton.tsx";
import {deleteComment} from "../../common/apis/comment.tsx";
import {useNavigate} from "react-router-dom";

function CommentCard({comment, handleLoadMoreSubComment, handleCommentSubmit, pageSize, depth = 0}: {
    comment: CommentType,
    handleLoadMoreSubComment: (page: number, parentId: string) => void,
    handleCommentSubmit: (commentId: string | null, content: string, taggedUsername: string | null, originalComment: CommentType | null) => void,
    pageSize: number,
    depth?: number,
}) {

    const navigate = useNavigate();
    const loginState = useSelector((state: RootState) => state.loginSlice);

    const [commentInput, setCommentInput] = useState("");
    const [editCommentInput, setEditCommentInput] = useState("");
    const [showTextField, setShowTextField] = useState(false);
    const [showEditTextField, setShowEditTextField] = useState(false);
    const [page, setPage] = useState(0);

    const handleCommentInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentInput(e.currentTarget.value);
    }
    const handleShowTextField = () => {
        setShowTextField(prev => !prev);
    }
    const handleOpenTextField = () => {
        setCommentInput("");
        setShowTextField(true);
    }

    const handleShowEdit = () => {
        setEditCommentInput(comment.content);
        setShowEditTextField(prev => !prev);
    }
    const handleEditCommentInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setEditCommentInput(e.currentTarget.value);
    }

    const handleDeleteComment = () => {
        if (!confirm("댓글을 삭제하시겠습니까?")) {
            return;
        }

        deleteComment(comment.id)
            .then(() => {
                alert("삭제되었습니다.");
                navigate(0);
            })
            .catch((error) => alert(error.response.data.message));
    }

    const taggedUsername = depth > 0 ? comment.member.username : null;


    return (
        <div className={`flex ${depth === 0 && "pb-4"}`}>
            {depth !== 0 && <div className="w-8"/>}
            <div className="flex-1 flex flex-col justify-center mt-4 text-sm">
                <div className="flex flex-col gap-y-2 border rounded-2xl border-gray-300 px-4 pt-4 pb-2">
                    <div className="flex items-center gap-x-2">
                        {comment.member.profileUrl
                            ? <img className="size-6 rounded-full hover:cursor-pointer"
                                   src={comment.member.profileUrl} alt="user_image"/>
                            : <MdOutlinePerson className="size-5 text-gray-600"/>}
                        <p className="font-bold">
                            {comment.member.username}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {fullDateToKorean(comment.createdAt)}
                        </p>
                    </div>
                    <div className="mt-4 text-gray-900 flex items-center gap-x-2">
                        {!showEditTextField &&
                            comment.taggedUsername &&
                            <span className="text-lime-700">
                            @{comment.taggedUsername}
                        </span>}
                        {showEditTextField
                            ? <CommentTextField
                                value={editCommentInput}
                                onChange={handleEditCommentInput}
                                handleSubmit={handleCommentSubmit}
                                taggedUsername={comment.taggedUsername}
                                originalComment={comment}
                                handleShowTextField={handleShowEdit}/>
                            : <div>{comment.content}</div>}
                    </div>
                    <div className="flex justify-between items-center">
                        {depth === 0 &&
                            <button
                                className="w-fit py-2 flex justify-center items-center gap-x-2 text-gray-600 hover:cursor-pointer rounded-md hover:brightness-120"
                                onClick={() => {
                                    handleLoadMoreSubComment(page, comment.id);
                                    setPage(page + 1);
                                }}>
                                <MdOutlineComment className="text-gray-600 size-4"/>
                                답글 ({comment.replyCount})
                            </button>}
                        <div/>
                        {loginState.isLogin && !showEditTextField &&
                            <div className="flex items-center gap-x-4 text-gray-600">
                                {comment.member.username === loginState.username &&
                                    <div className="flex items-center">
                                        <TextButton text={"수정"} onClick={handleShowEdit}/>
                                        <TextButton text={"삭제"} onClick={handleDeleteComment}/>
                                    </div>
                                }
                                <button
                                    className="w-fit py-2 flex justify-center items-center gap-x-2 hover:cursor-pointer rounded-md hover:brightness-120"
                                    onClick={handleOpenTextField}>
                                    <MdOutlineAddComment className="size-4"/>
                                    댓글 작성하기
                                </button>
                            </div>
                        }
                    </div>
                </div>
                <div>
                    {showTextField &&
                        <CommentTextField
                            value={commentInput}
                            onChange={handleCommentInput}
                            handleSubmit={handleCommentSubmit}
                            commentId={comment.id}
                            taggedUsername={taggedUsername}
                            handleShowTextField={handleShowTextField}/>}
                </div>
                {comment.subComments &&
                    <div>
                        {comment.subComments.map((comment) =>
                            (depth <= 2)
                                ? <CommentCard
                                    key={comment.id}
                                    comment={comment}
                                    handleLoadMoreSubComment={handleLoadMoreSubComment}
                                    handleCommentSubmit={handleCommentSubmit}
                                    pageSize={pageSize}
                                    depth={depth + 1}/>
                                : null)}
                        {page !== 0 && (page) * 10 < comment.replyCount &&
                            <LoadMoreButton
                                addStyle="mt-2 ml-8 w-[calc(100%-36px)] !bg-gray-400"
                                onClick={() => {
                                    handleLoadMoreSubComment(page, comment.id);
                                    setPage(page + 1);
                                }}/>}
                    </div>}
            </div>
        </div>
    );
}

export default CommentCard;