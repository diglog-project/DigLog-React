import {Link} from "react-router-dom";

const className = "bg-transparent hover:text-lime-700 py-2 px-4";

export function TextButton({text, onClick}: { text: string, onClick?: () => void }) {
    return (
        <button onClick={onClick} className={className}>
            {text}
        </button>
    );
}

export function TextLink({text, to, color}: { text: string, to: string, color?: string }) {

    return (
        <Link to={to} className={(color === "lime") ? "text-lime-700 hover:text-lime-400 " : "" + className}>
            {text}
        </Link>
    );
}