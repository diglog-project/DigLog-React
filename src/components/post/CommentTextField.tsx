import {ChangeEventHandler, useState} from 'react';
import {FillButton} from "../common/FillButton.tsx";
import {TextButton} from "../common/TextButton.tsx";
import {CommentType} from "../../common/types/comment.tsx";

interface CommentTextFieldProps {
    value: string,
    onChange: ChangeEventHandler<HTMLTextAreaElement>,
    commentId?: string,
    taggedUsername?: string | null,
    originalComment?: CommentType | null,
    handleSubmit: (commentId: string | null, content: string, taggedUsername: string | null, originalComment: CommentType | null) => void,
    handleShowTextField?: () => void,
}

function CommentTextField(props: CommentTextFieldProps) {

    const {value, onChange, commentId, taggedUsername, originalComment, handleSubmit, handleShowTextField} = props;

    const [username, setUsername] = useState<string | null>(taggedUsername || null);

    return (
        <div className="w-full my-2 flex flex-col justify-center gap-y-2">
            <textarea
                value={value}
                onChange={onChange}
                className="p-2 border border-gray-400"
                rows={5}
                minLength={5}/>
            <div className="flex justify-between items-center gap-x-2">
                {username &&
                    <FillButton text={`@${username}`}
                                onClick={() => setUsername(null)}
                                addStyle="w-fit !bg-gray-400 text-xs"/>}
                <div/>
                <div className="flex">
                    {(commentId || originalComment) && <TextButton text={"취소"} onClick={() => {
                        if (handleShowTextField) {
                            handleShowTextField();
                        }
                    }}/>}
                    <FillButton text={(!originalComment) ? "등록" : "수정"}
                                onClick={() => handleSubmit(commentId || null, value, username || null, originalComment || null)}/>
                </div>
            </div>
        </div>
    );
}

export default CommentTextField;