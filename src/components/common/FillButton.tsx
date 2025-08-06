import { Link } from "react-router-dom";

const className = " bg-lime-500 hover:brightness-105 text-white text-sm font-semibold py-2 px-4 rounded hover:cursor-pointer";

export function FillButton({ text, onClick, addStyle, disabled }: {
    text: string,
    onClick: () => void,
    addStyle?: string,
    disabled?: boolean
}) {
    return (
        <button
            onClick={onClick}
            className={`${addStyle} ${className}`}
            disabled={disabled}>
            {text}
        </button>
    );
}

export function FillLink({ text, to, addStyle }: { text: string, to: string, addStyle?: string }) {
    return (
        <Link to={to} className={`${addStyle} ${className}`}>
            {text}
        </Link>
    );
}

export function LoadMoreButton({ onClick, addStyle, disabled }: {
    onClick: () => void,
    addStyle?: string,
    disabled?: boolean
}) {
    return (
        <FillButton
            text={"더 불러오기"}
            onClick={onClick}
            addStyle={`${addStyle} "!bg-gray-400 hover:brightness-105"`}
            disabled={disabled} />
    );
}