import {Link, useNavigate, useParams} from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout.tsx";
import {PostResponse} from "../../common/types/post.tsx";
import {faker} from "@faker-js/faker/locale/ko";
import DOMPurify from "dompurify";
import {fullDateToKorean} from "../../common/util/date.tsx";
import TagCard from "../../components/post/TagCard.tsx";

function PostPage() {

    const {id} = useParams();
    console.log(id);
    const navigate = useNavigate();

    const post: PostResponse = {
        id: faker.number.int().toString(),
        title: faker.lorem.sentence(),
        content: `<img src=${faker.image.url({width: 320, height: 320})}/><div>${faker.lorem.paragraphs()}</div>`,
        username: faker.animal.cat(),
        tags: [{id: "1", name: faker.lorem.word()}, {id: "2", name: faker.lorem.word()}],
        createdAt: new Date(),
    };

    const safeContent = DOMPurify.sanitize(post.content);

    return (
        <BasicLayout>
            <div>
                <div className="flex flex-col gap-y-8">
                    <div className="flex justify-center items-center gap-x-4">
                        <Link to={`/blog/${post.username}`} className="text-xs">Home</Link>
                        <div className="text-xs">{` > `}</div>
                        <Link to={`/blog/${post.username}?category=카테고리`} className="text-xs">카테고리</Link>
                        <div>{` > `}</div>
                        <div className="text-xs text-gray-600">{post.title}</div>
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
                    <div className="text-center leading-relaxed text-4xl text-gray-900 font-jalnan">
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