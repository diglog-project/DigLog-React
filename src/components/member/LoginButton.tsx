import {ReactNode} from "react";

function LoginButton({text, onClick, bgColor, icon}: {
    text: string,
    onClick: () => void,
    bgColor: string,
    icon?: ReactNode
}) {
    return (
        <button onClick={onClick}
                className={`rounded-[calc(12px)] ${bgColor} w-full h-14 flex gap-x-2 justify-center items-center hover:brightness-105 hover:cursor-pointer`}>
            {(icon) ? icon : <div></div>}
            <div>{text}</div>
            <div></div>
        </button>
    );
}

export default LoginButton;