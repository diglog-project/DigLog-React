import { ReactNode } from 'react';

function LoginButton({
    text,
    onClick,
    bgColor,
    disable,
    icon,
}: {
    text: string;
    onClick: () => void;
    bgColor: string;
    disable?: boolean;
    icon?: ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-[calc(12px)] ${bgColor} ${
                disable && 'opacity-40 hover:!cursor-auto'
            } w-full h-14 flex gap-x-2 justify-center items-center hover:brightness-105 hover:cursor-pointer cursor`}
        >
            {icon ? icon : null}
            <div>{text}</div>
        </button>
    );
}

export default LoginButton;
