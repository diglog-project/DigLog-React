import { Link } from 'react-router-dom';

const className =
    ' bg-transparent hover:bg-lime-300 text-lime-700 font-semibold hover:text-white py-2 px-4 border border-lime-500 hover:border-transparent rounded hover:cursor-pointer';

export function OutlineButton({ text, onClick, addStyle }: { text: string; onClick?: () => void; addStyle?: string }) {
    return (
        <button onClick={onClick} className={`${addStyle} ${className}`}>
            {text}
        </button>
    );
}

export function OutlineLink({ text, to, addStyle }: { text: string; to: string; addStyle?: string }) {
    return (
        <Link to={to} className={`${addStyle} ${className}`}>
            {text}
        </Link>
    );
}
