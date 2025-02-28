import {ChangeEventHandler} from 'react';
import {FillButton} from "../common/FillButton.tsx";
import {TextButton} from "../common/TextButton.tsx";

interface CommentTextFieldProps {
    value: string,
    onChange: ChangeEventHandler<HTMLTextAreaElement>,
    commentId?: string,
    handleSubmit: (commentId: string | null, content: string) => void,
    handleShowTextField?: () => void,
}

function CommentTextField(props: CommentTextFieldProps) {

    const {value, onChange, commentId, handleSubmit, handleShowTextField} = props;

    return (
        <div className="my-2 flex flex-col justify-center gap-y-2">
            <textarea
                value={value}
                onChange={onChange}
                className="p-2 border border-gray-400"
                rows={5}
                minLength={5}/>
            <div className="flex justify-end gap-x-2">
                {commentId && <TextButton text={"취소"} onClick={() => {
                    if (handleShowTextField) {
                        handleShowTextField();
                    }
                }}/>}
                <FillButton text={"등록"} onClick={() => handleSubmit(commentId || null, value)}/>
            </div>
        </div>
    );
}

export default CommentTextField;