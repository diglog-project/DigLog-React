import {Link} from "react-router-dom";

const className = " bg-lime-500 hover:bg-lime-400 text-white font-bold py-2 px-4 rounded hover:cursor-pointer";

export function FillButton({text, onClick, addStyle}: { text: string, onClick: () => void, addStyle?: string }) {

    return (
        <button onClick={onClick} className={(addStyle) ? addStyle + className : className}>
            {text}
        </button>
    );
}

export function FillLink({text, to}: { text: string, to: string }) {
    return (
        <Link to={to} className={className}>
            {text}
        </Link>
    );
}
