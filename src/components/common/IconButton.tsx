import { ReactNode } from 'react';

function IconButton({ icon, onClick, addStyle }: { icon: ReactNode; onClick: () => void; addStyle?: string }) {
    return (
        <button
            onClick={onClick}
            className={`${addStyle} size-10 rounded-full hover:bg-gray-100 hover:cursor-pointer flex justify-center items-center`}
        >
            {icon}
        </button>
    );
}

export default IconButton;
