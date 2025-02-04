import {Link} from "react-router-dom";

const className = " bg-transparent py-2 px-4";

export function TextButton({text, onClick}: { text: string, onClick?: () => void }) {
    return (
        <button onClick={onClick} className={className}>
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