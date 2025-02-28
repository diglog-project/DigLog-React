import {ChangeEventHandler, useState} from 'react';
import {FillButton} from "../common/FillButton.tsx";
import {TextButton} from "../common/TextButton.tsx";

interface CommentTextFieldProps {
    value: string,
    onChange: ChangeEventHandler<HTMLTextAreaElement>,
    commentId?: string,
    taggedUsername?: string | null,
    handleSubmit: (commentId: string | null, content: string, taggedUsername: string | null) => void,
    handleShowTextField?: () => void,
}

function CommentTextField(props: CommentTextFieldProps) {

    const {value, onChange, commentId, taggedUsername, handleSubmit, handleShowTextField} = props;

    const [username, setUsername] = useState<string | null>(taggedUsername || null);

    return (
        <div className="my-2 flex flex-col justify-center gap-y-2">
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
                    {commentId && <TextButton text={"취소"} onClick={() => {
                        if (handleShowTextField) {
                            handleShowTextField();
                        }
                    }}/>}
                    <FillButton text={"등록"} onClick={() => handleSubmit(commentId || null, value, username || null)}/>
                </div>
            </div>
        </div>
    );
}

export default CommentTextField;