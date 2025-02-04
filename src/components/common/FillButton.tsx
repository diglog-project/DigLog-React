import {Link} from "react-router-dom";

const className = "bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded";

export function FillButton({text, onClick}: { text: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className={className}>
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
