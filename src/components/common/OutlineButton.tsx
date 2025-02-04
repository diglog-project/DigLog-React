import {Link} from "react-router-dom";

const className = "bg-transparent hover:bg-lime-300 text-lime-700 font-semibold hover:text-white py-2 px-4 border border-lime-500 hover:border-transparent rounded hover:cursor-pointer";

export function OutlineButton({text, onClick}: { text: string, onClick?: () => void }) {
    return (
        <button onClick={onClick} className={className}>
            {text}
        </button>
    );
}

export function OutlineLink({text, to}: { text: string, to: string }) {
    return (
        <Link to={to} className={className}>
            {text}
        </Link>
    );
}