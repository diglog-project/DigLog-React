import {faker} from "@faker-js/faker/locale/ko";
import {dateToKorean} from "../../common/util/date.tsx";
import {MdOutlineAddComment, MdOutlineComment, MdOutlinePerson} from "react-icons/md";
import {ChangeEvent, useState} from "react";
import CommentTextField from "./CommentTextField.tsx";
import {CommentType} from "../../common/types/comment.tsx";
import {LoadMoreButton} from "../common/FillButton.tsx";

function CommentCard({comment, handleLoadMoreSubComment, pageSize, depth = 0}: {
    comment: CommentType,
    handleLoadMoreSubComment: (page: number, parentId: string) => void,
    pageSize: number,
    depth?: number,
}) {

    const [commentInput, setCommentInput] = useState("");
    const [showTextField, setShowTextField] = useState(false);
    const [page, setPage] = useState(0);

    const handleCommentInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentInput(e.currentTarget.value);
    }
    const handleShowTextField = () => {
        setShowTextField(prev => !prev);
    }
    const handleSubmit = (commentId: string | undefined) => {
        confirm("댓글을 등록하시겠습니까?");
        alert("등록되었습니다.");
        console.log(commentId);
    }

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
                            {dateToKorean(comment.createdAt)}
                        </p>
                    </div>
                    <p className="mt-4 text-gray-900">
                        {comment.content}
                    </p>
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
                        <button
                            className="w-fit py-2 flex justify-center items-center gap-x-2 text-gray-600 hover:cursor-pointer rounded-md hover:brightness-120"
                            onClick={() => setShowTextField(true)}>
                            <MdOutlineAddComment className="text-gray-600 size-4"/>
                            댓글 작성하기
                        </button>
                    </div>
                </div>
                <div>
                    {showTextField &&
                        <CommentTextField
                            value={commentInput}
                            onChange={handleCommentInput}
                            handleSubmit={handleSubmit}
                            commentId={faker.number.int().toString()}
                            handleShowTextField={handleShowTextField}/>}
                </div>
                {comment.subComments &&
                    <div>
                        {comment.subComments.map((comment) =>
                            (depth <= 2)
                                ? <CommentCard
                                    key={faker.animal.cow()}
                                    comment={comment}
                                    handleLoadMoreSubComment={handleLoadMoreSubComment}
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