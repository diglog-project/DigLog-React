import {Link, useNavigate, useParams} from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout.tsx";
import DOMPurify from "dompurify";
import {fullDateToKorean} from "../../common/util/date.tsx";
import TagCard from "../../components/post/TagCard.tsx";
import {getPost} from "../../common/apis/post.tsx";
import {useEffect, useState} from "react";
import {PostResponse} from "../../common/types/post.tsx";
import {checkUUID} from "../../common/util/regex.tsx";

function PostPage() {

    const {id} = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<PostResponse>({
        id: "",
        title: "",
        content: "",
        username: "",
        tags: [],
        createdAt: new Date(),
    });

    useEffect(() => {
        if (id === null || id === undefined || !checkUUID(id)) {
            alert("올바르지 않은 주소입니다.");
            navigate(-1);
            return;
        }

        getPost(id)
            .then((res) => {
                console.log(res.data);
                setPost({
                    ...res.data,
                    id: id,
                    createdAt: new Date(),
                });
            })
            .catch((error) => alert(error.response.data.message));
    }, []);

    const safeContent = DOMPurify.sanitize(post.content);

    return (
        <BasicLayout>
            <div className="w-full">
                <div className="flex flex-col gap-y-8">
                    <div className="flex justify-center items-center gap-x-4">
                        <Link to={`/blog/${post.username}`} className="text-xs">Home</Link>
                        <div className="text-xs">{` > `}</div>
                        <Link to={`/blog/${post.username}?folder=폴더`} className="text-xs">폴더</Link>
                        <div>{` > `}</div>
                        <div className="text-xs text-gray-600 max-w-96 md:max-w-192 break-words">{post.title}</div>
                    </div>
                    <div className="flex flex-row w-full justify-center text-center items-center gap-4">
                        <Link to={`/blog/${post.username}`}
                              className="text-md font-semibold text-lime-700 hover:text-lime-400">
                            {post.username}
                        </Link>
                        <div className="text-md text-gray-600">
                            {fullDateToKorean(post.createdAt)}
                        </div>
                    </div>
                    <div className="text-center leading-relaxed text-4xl text-gray-900 font-jalnan break-words">
                        {post.title}
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {post.tags.map(tag =>
                            <TagCard key={tag.id} tag={tag} onClick={() => {
                                navigate(`/search?word=${tag.name}&option=태그`)
                            }}/>)}
                    </div>
                    <div className="flex justify-between items-center">

                        <div></div>
                    </div>
                </div>
                <div className="py-8"
                     dangerouslySetInnerHTML={{__html: safeContent}}/>
            </div>
        </BasicLayout>
    );
}

export default PostPage;