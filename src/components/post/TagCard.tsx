import {Link} from "react-router-dom";
import {TagResponse} from "../../common/types/post.tsx";

function TagCard({tag}: { tag: TagResponse }) {
    return (
        <Link to={`/search?tag=${tag.name}`}
              className="border border-lime-50 shadow text-lime-700 rounded-4xl px-4 py-2 font-semibold text-sm
               transform transition-all hover:bg-lime-50 hover:text-lime-500">
            {tag.name}
        </Link>
    );
}

export default TagCard;