import BasicLayout from "../../layout/BasicLayout.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {PostResponse, TagResponse} from "../../common/types/post.tsx";
import {PageResponse} from "../../common/types/common.tsx";
import {getMemberTags} from "../../common/apis/blog.tsx";
import TagCard from "../../components/post/TagCard.tsx";
import PostCard from "../../components/post/PostCard.tsx";
import {getMemberTagPosts} from "../../common/apis/post.tsx";
import PaginationButton from "../../components/common/PaginationButton.tsx";
import {TextLink} from "../../components/common/TextButton.tsx";

function BlogTagPage() {

    const {username} = useParams();
    const navigate = useNavigate();
    const {state} = useLocation();
    const {tagId} = state;


    const [tags, setTags] = useState<TagResponse[]>([]);
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [selectedTag, setSelectedTag] = useState<TagResponse | null>({
        id: tagId || "",
        name: "",
    });

    const [page, setPage] = useState(0);
    const [pageInfo, setPageInfo] = useState<PageResponse>({
        number: 0, size: 3, totalPages: 0, totalElements: 0,
    });

    const handleSelectedTag = (tag: TagResponse) => {
        setSelectedTag(tag);
        setPage(0);
    }

    useEffect(() => {
        if (!username) {
            alert("잘못된 url 경로입니다.");
            navigate(-1);
            return;
        }

        getMemberTags(username)
            .then(res => {
                const tags: TagResponse[] = res.data;
                setTags(tags);
                setSelectedTag(tags.find(tag => tag.id === tagId) || null);
            })
            .catch(error => alert(error.response.data.message));
    }, []);

    useEffect(() => {
        if (!selectedTag) {
            return;
        }

        if (typeof username !== "string") {
            return;
        }

        getMemberTagPosts({
            username: username,
            tagId: selectedTag.id,
            page: page,
            size: pageInfo.size,
        })
            .then(res => {
                setPosts(res.data.content);
                setPageInfo(res.data.page);
            })
            .catch(error => alert(error.response.data.message));
    }, [selectedTag, page]);

    return (
        <BasicLayout>
            <div className="w-full flex flex-col gap-y-8">
                <TextLink text={`${username}의 블로그`}
                          to={`/blog/${username}`}
                          addStyle="flex justify-start !text-2xl !font-jalnan"/>
                <div className="flex gap-x-4">
                    {tags.map(tag =>
                        <TagCard
                            tag={tag}
                            onClick={() => handleSelectedTag(tag)}/>)}
                </div>
                <p>
                    {selectedTag && <span className="mr-2 font-bold">"{selectedTag.name}"</span>}
                    {pageInfo.totalElements}개의 게시글
                </p>
                <div className="w-full flex flex-col items-center gap-x-4">
                    {posts.map(post => <PostCard post={post}/>)}
                </div>
                <PaginationButton pageInfo={pageInfo} setPage={setPage}/>
            </div>
        </BasicLayout>
    );
}

export default BlogTagPage;