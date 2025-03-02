import BlogSearchBar from "../../components/blog/BlogSearchBar.tsx";
import {useEffect, useState} from "react";
import {MdSearch} from "react-icons/md";
import {PostResponse} from "../../common/types/post.tsx";
import {TextLink} from "../../components/common/TextButton.tsx";
import PaginationButton from "../../components/common/PaginationButton.tsx";
import {PageResponse} from "../../common/types/common.tsx";
import {fullDateToKorean} from "../../common/util/date.tsx";
import {getMemberPosts} from "../../common/apis/blog.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";

function PostSettingPage() {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    const [inputSearch, setInputSearch] = useState("");
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [page, setPage] = useState(0);
    const [pageInfo, setPageInfo] = useState<PageResponse>({number: 0, size: 10, totalElements: 0, totalPages: 0});

    useEffect(() => {
        if (!loginState.username) {
            return;
        }

        getMemberPosts({
            username: loginState.username,
            folderId: null,
            page: page,
            size: pageInfo.size,
        })
            .then((res) => {
                setPosts([...res.data.content]);
                setPageInfo(res.data.page);
            })
            .catch((error) => alert(error.response.data.message));
    }, [loginState, page]);

    return (
        <div>
            <div className="flex justify-between items-center">
                <p className="font-semibold text-xl my-4">게시글 관리</p>
                <div className="flex items-center gap-x-4">
                    <BlogSearchBar value={inputSearch} setValue={setInputSearch}/>
                    <button className="hover:cursor-pointer">
                        <MdSearch className="size-5"/>
                    </button>
                </div>
            </div>
            <div>
                {posts.map((post: PostResponse) => (
                    <div key={post.id}
                         className="flex justify-between items-center rounded-2xl shadow p-4 my-4">
                        <div className="flex flex-col gap-y-2 flex-1">
                            <p className="font-semibold">{post.title}</p>
                            <p className="text-sm font-light">{fullDateToKorean(post.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-x-4">
                            <TextLink text={"수정"} to={`/post/edit/${post.id}`}
                                      addStyle={"text-sm hover:text-lime-600"}/>
                        </div>
                    </div>
                ))}
                {posts.length === 0 &&
                    <div className="mt-8 w-full text-center text-gray-600">
                        작성된 게시글이 없습니다.
                    </div>}
            </div>
            <PaginationButton pageInfo={pageInfo} setPage={setPage}/>
        </div>
    );
}

export default PostSettingPage;