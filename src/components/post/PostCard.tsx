import {PostResponse} from "../../common/types/post.tsx";
import {getImgSrc, removeHtmlTags} from "../../common/util/html.tsx";
import DOMPurify from "dompurify";
import {MdImage} from "react-icons/md";
import {dateToKorean} from "../../common/util/date.tsx";
import {Link} from "react-router-dom";

function PostCard({post}: { post: PostResponse }) {

    const safeContent = DOMPurify.sanitize(post.content);
    const url = getImgSrc(safeContent);

    return (
        <div className="mx-auto h-96 w-full">
            <Link to={`/post/${post.id}`} className="rounded-xl overflow-hidden block">
                {(url)
                    ? <img className="w-full h-52 object-cover
                     transform transition-transform duration-300 ease-out hover:scale-105"
                           src={url} alt="post_image"/>
                    : <div className="bg-gray-100 flex justify-center items-center w-full h-52">
                        <MdImage className="size-16 text-gray-400"/>
                    </div>}
            </Link>
            <div className="flex flex-col gap-y-2 my-4">
                <div className="flex justify-between items-center">
                    <div className="flex justify-center items-center gap-x-4">
                        <Link to={`/blog/${post.username}`}
                              className="text-sm font-semibold text-lime-700 hover:text-lime-400">
                            {post.username}
                        </Link>
                        <div className="text-sm text-gray-500 font-semibold">
                            {dateToKorean(post.createdAt)}
                        </div>
                    </div>
                    {/*<div className="flex justify-end items-center gap-x-3 text-sm text-gray-400">*/}
                    {/*    <div className="flex items-center gap-x-1.5">*/}
                    {/*        <FaRegHeart className="size-3"/>*/}
                    {/*        <p className="text-gray-900">20</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <Link to={`/post/${post.id}`}>
                    <div className="line-clamp-2 text-lg hover:text-gray-600 font-medium">
                        {post.title}
                    </div>
                </Link>
                <div className="line-clamp-3 text-gray-500 font-normal">
                    {removeHtmlTags(safeContent)}
                </div>
            </div>
        </div>
    );
}

export default PostCard;