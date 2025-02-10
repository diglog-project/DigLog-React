import {TagResponse} from "../../common/types/post.tsx";

function TagCard({tag, onClick}: { tag: TagResponse, onClick: (tagName: string) => void }) {
    return (
        <button
            className="border border-lime-50 shadow text-lime-700 rounded-4xl px-4 py-2 font-semibold text-sm
               transform transition-all hover:bg-lime-50 hover:text-lime-500 hover:cursor-pointer"
            onClick={() => onClick(tag.name)}>
            {tag.name}
        </button>
    );
}

export default TagCard;