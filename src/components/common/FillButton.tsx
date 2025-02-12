import {Link} from "react-router-dom";

const className = " bg-lime-500 hover:bg-lime-400 text-white font-bold py-2 px-4 rounded hover:cursor-pointer";

export function FillButton({text, onClick, addStyle}: { text: string, onClick: () => void, addStyle?: string }) {
    return (
        <button onClick={onClick} className={(addStyle) ? addStyle + className : className}>
            {text}
        </button>
    );
}

export function FillLink({text, to, addStyle}: { text: string, to: string, addStyle?: string }) {
    return (
        <Link to={to} className={(addStyle) ? addStyle + className : className}>
            {text}
        </Link>
    );
}

export function LoadMoreButton({onClick, addStyle}: { onClick: () => void, addStyle?: string }) {
    return (
        <FillButton text={"더 불러오기"} onClick={onClick} addStyle={addStyle + " !bg-gray-400 hover:brightness-105"}/>
    );
}