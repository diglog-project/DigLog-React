import {faker} from "@faker-js/faker/locale/ko";
import {dateToKorean} from "../../common/util/date.tsx";
import {MdOutlineAddComment, MdOutlineComment} from "react-icons/md";
import {ChangeEvent, useState} from "react";
import CommentTextField from "./CommentTextField.tsx";

function CommentCard({depth = 0}: { depth?: number }) {

    const [openComment, setOpenComment] = useState(depth !== 0);
    const [commentInput, setCommentInput] = useState("");
    const [showTextField, setShowTextField] = useState(false);

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
                        <img className="size-6 rounded-full hover:cursor-pointer"
                             src={faker.image.avatar()} alt="user_image"/>
                        <p className="font-bold">
                            {faker.animal.cow()}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {dateToKorean(faker.date.anytime())}
                        </p>
                    </div>
                    <p className="mt-4 text-gray-900">
                        {faker.lorem.paragraph()}
                    </p>
                    <div className="flex justify-between items-center">
                        {depth === 0 &&
                        <button
                            className="w-fit py-2 flex justify-center items-center gap-x-2 text-gray-600 hover:cursor-pointer rounded-md hover:brightness-120"
                            onClick={() => setOpenComment(prev => !prev)}>
                            <MdOutlineComment className="text-gray-600 size-4"/>
                            {!openComment ? "답글 (10)" : "답글 닫기"}
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
                <div className="ml-8">
                    {showTextField &&
                        <CommentTextField
                            value={commentInput}
                            onChange={handleCommentInput}
                            handleSubmit={handleSubmit}
                            commentId={faker.number.int().toString()}
                            handleShowTextField={handleShowTextField}/>}
                </div>
                {openComment &&
                    <div>
                        {Array.from({length: 2}).map(() =>
                            (depth <= 2)
                                ? <CommentCard key={faker.animal.cow()} depth={depth + 1}/>
                                : null)}
                    </div>
                }
            </div>
        </div>
    );
}

export default CommentCard;