import {PostResponse} from "../../common/types/post.tsx";
import {getImgSrc, removeImgTags} from "../../common/util/html.tsx";
import DOMPurify from "dompurify";
import {MdImage} from "react-icons/md";
import {dateToKorean} from "../../common/util/date.tsx";
import {Link} from "react-router-dom";

function PostCard(post: PostResponse) {

    const safeContent = DOMPurify.sanitize(post.content);
    const url = getImgSrc(safeContent);

    return (
        <div className="mx-auto h-96 w-full">
            <Link to={`/post/${post.id}`} className="rounded-xl overflow-hidden block">
                {(url)
                    ? <img className="w-full h-52 object-cover
                     transform transition-transform duration-300 ease-out hover:scale-105"
                           src={url} alt="post_image"/>
                    : <div className="flex justify-center items-center w-full h-52">
                        <MdImage className="size-16 text-gray-400"/>
                    </div>}
            </Link>
            <div className="flex flex-col gap-y-2 my-4">
                <div className="flex items-center gap-4">
                    <Link to={"/"}
                          className="text-sm font-semibold text-lime-700 hover:text-lime-400">
                        {post.username}
                    </Link>
                    <div className="text-sm text-gray-500 font-semibold">
                        {dateToKorean(post.createdAt)}
                    </div>
                </div>
                <Link to={`/post/${post.id}`}>
                    <div className="line-clamp-2 text-lg hover:text-gray-600 font-semibold">
                        {post.title}
                    </div>
                </Link>
                <div className="line-clamp-3 text-gray-500 font-normal">
                    {removeImgTags(safeContent)}
                </div>
            </div>
        </div>
    );
}

export default PostCard;