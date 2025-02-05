import {ReactNode} from 'react';

function IconButton({icon, onClick}: { icon: ReactNode; onClick: () => void }) {
    return (
        <button onClick={onClick} className="size-10 rounded-full hover:bg-gray-100 hover:cursor-pointer flex justify-center items-center">
            {icon}
        </button>
    );
}

export default IconButton;