import {ChangeEvent, useEffect, useState} from "react";
import {PostResponse} from "../../common/types/post.tsx";
import {TextLink} from "../../components/common/TextButton.tsx";
import PaginationButton from "../../components/common/PaginationButton.tsx";
import {PageResponse} from "../../common/types/common.tsx";
import {fullDateToKorean} from "../../common/util/date.tsx";
import {getMemberPosts} from "../../common/apis/blog.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";
import {FillButton} from "../../components/common/FillButton.tsx";
import {updatePostFolder} from "../../common/apis/post.tsx";
import FolderSelectBox from "../../components/folder/FolderSelectBox.tsx";
import {FolderType} from "../../common/types/blog.tsx";
import {faker} from "@faker-js/faker/locale/ko";

function PostSettingPage() {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [page, setPage] = useState(0);
    const [pageInfo, setPageInfo] = useState<PageResponse>({number: 0, size: 10, totalElements: 0, totalPages: 0});

    const [isFolderEdit, setIsFolderEdit] = useState(false);
    const [postIds, setPostIds] = useState<string[]>([]);
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [targetFolder, setTargetFolder] = useState<FolderType | null>(null);

    const handleIsFolderEdit = () => {
        if (!isFolderEdit) {
            setIsFolderEdit(true);
            setPostIds([]);
            setTargetFolder(null);
            return;
        }

        if (postIds.length === 0) {
            setIsFolderEdit(false);
            return;
        }

        if (confirm("폴더 수정을 취소하시겠습니까?")) {
            setIsFolderEdit(false);
            return;
        }
    }

    const handleClickCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;

        if (checked) {
            setPostIds(prev => [...prev, name]);
        } else {
            setPostIds(prev => prev.filter(id => id !== name));
        }
    }
    const handleCheckBox = (id: string) => {
        return postIds.indexOf(id) > -1;
    }

    const submitPostFolderUpdate = () => {
        if (!confirm("변경사항을 저장하시겠습니까?")) {
            return;
        }

        updatePostFolder({
            postIds: postIds,
            folderId: targetFolder?.id || null,
        })
            .then(() => {
                alert("폴더가 수정되었습니다.");
                setIsFolderEdit(false);
            })
            .catch((error) => alert(error.response.data.message));
    }

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

        // todo: folders 데이터
        const folderData: FolderType[] = [
            {
                id: crypto.randomUUID(),
                title: faker.lorem.words(),
                subFolders: [
                    {
                        id: crypto.randomUUID(),
                        title: faker.lorem.words(),
                        subFolders: [
                            {
                                id: crypto.randomUUID(),
                                title: faker.lorem.words(),
                                subFolders: [],
                            },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        title: faker.lorem.words(),
                        subFolders: [],
                    },
                ]
            },
            {
                id: crypto.randomUUID(),
                title: faker.lorem.words(),
                subFolders: [
                    {
                        id: crypto.randomUUID(),
                        title: faker.lorem.words(),
                        subFolders: [],
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                title: faker.lorem.words(),
                subFolders: [
                    {
                        id: crypto.randomUUID(),
                        title: faker.lorem.words(),
                        subFolders: [],
                    },
                    {
                        id: crypto.randomUUID(),
                        title: faker.lorem.words(),
                        subFolders: [],
                    },
                    {
                        id: crypto.randomUUID(),
                        title: faker.lorem.words(),
                        subFolders: [],
                    },
                ]
            },
        ];
        setFolders(folderData);
    }, [loginState, page]);

    return (
        <div>
            <div className="flex justify-between items-center gap-x-4 my-4">
                <p className="font-semibold text-xl">게시글 관리</p>
                {isFolderEdit &&
                    <div
                        className="flex justify-end flex-1 flex-wrap-reverse md:flex-nowrap max-w-64 md:max-w-[calc(600px)] items-center gap-x-2">
                        <FolderSelectBox
                            folders={folders}
                            targetFolder={targetFolder}
                            setTargetFolder={setTargetFolder}
                            center={false}/>
                        <FillButton text={"취소"} onClick={handleIsFolderEdit} addStyle={"!bg-gray-400 w-22 h-10"}/>
                        <FillButton text={"저장"} onClick={submitPostFolderUpdate} addStyle={"w-22 h-10"}/>
                    </div>}
                {!isFolderEdit &&
                    <div className="flex gap-x-2">
                        <FillButton text={"폴더 수정"} onClick={handleIsFolderEdit}/>
                    </div>}
            </div>
            <div>
                {posts.map((post: PostResponse) => (
                    <div key={post.id}
                         className="flex justify-between items-center rounded-2xl shadow p-4 my-4">
                        <div className="flex flex-col gap-y-2 flex-1">
                            <p className="font-semibold">{post.title}</p>
                            <p className="text-sm font-light">{fullDateToKorean(post.createdAt)}</p>
                        </div>
                        {!isFolderEdit &&
                            <div className="flex items-center gap-x-4">
                                <TextLink text={"수정"} to={`/post/edit/${post.id}`}
                                          addStyle={"text-sm hover:text-lime-600"}/>
                            </div>}
                        {isFolderEdit &&
                            <input type={"checkbox"}
                                   className=""
                                   name={post.id}
                                   checked={handleCheckBox(post.id)}
                                   onChange={handleClickCheckBox}/>}
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