import BasicLayout from "../layout/BasicLayout.tsx";
import PostCard from "../components/post/PostCard.tsx";
import {useEffect, useRef, useState} from "react";
import {getPosts} from "../common/apis/post.tsx";
import {PostResponse} from "../common/types/post.tsx";
import useInfiniteScroll from "../common/util/infiniteScroll.tsx";

function MainPage() {

    const pageRef = useRef<HTMLDivElement>(null);
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const {page} = useInfiniteScroll({
        target: pageRef,
        targetArray: posts,
        threshold: 0.5,
        endPoint: 4,
    });
    const pageSize = 12;

    useEffect(() => {
        getPosts({
            sorts: ["createdAt"],
            page: page,
            size: pageSize,
            isDescending: true,
        })
            .then((res) => {
                setPosts([...posts, ...res.data.content]);
            })
            .catch(() => alert("데이터 로드 중 문제가 발생했습니다. 다시 시도해주세요."));
    }, [page]);

    return (
        <BasicLayout>
            <div className="w-full flex flex-col justify-center items-start">
                <div className="text-2xl font-jalnan mb-8">
                    인기 있는 게시글
                </div>
                <div ref={pageRef}
                     className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            content={post.content}
                            username={post.username}
                            tags={post.tags}
                            createdAt={post.createdAt}/>
                    ))}
                </div>
            </div>
        </BasicLayout>
    );
}

export default MainPage;