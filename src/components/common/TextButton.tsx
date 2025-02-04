import {Link} from "react-router-dom";

const className = " flex justify-center items-center bg-transparent py-2 px-4 hover:cursor-pointer";

export function TextButton({text, onClick, addStyle}: { text: string, onClick?: () => void, addStyle?: string }) {
    return (
        <button onClick={onClick} className={(addStyle) ? addStyle + className : className}>
            {text}
        </button>
    );
}

export function TextLink({text, to, addStyle}: { text: string, to: string, addStyle?: string }) {

    return (
        <Link to={to} className={(addStyle) ? addStyle + className : className}>
            {text}
        </Link>
    );
}