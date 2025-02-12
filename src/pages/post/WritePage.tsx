import BasicLayout from "../../layout/BasicLayout.tsx";
import {useEffect, useRef, useState} from "react";
import {useBlocker, useNavigate} from "react-router-dom";
import {Editor} from "@tinymce/tinymce-react";
import {FillButton} from "../../components/common/FillButton.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";
import {faker} from "@faker-js/faker/locale/ko";
import {MdOutlineArrowDropDown, MdOutlineClear} from "react-icons/md";
import {createPost} from "../../common/apis/post.tsx";
import LoadingLayout from "../../layout/LoadingLayout.tsx";
import {getImgUrls} from "../../common/util/html.tsx";
import {uploadImage} from "../../common/apis/image.tsx";

interface WritePostType {
    inputTag: string;
    tags: string[];
    title: string;
    content: string;
}

interface FolderType {
    name: string;
    subFolders?: FolderType[];
}

function WritePage() {

    const loginState = useSelector((state: RootState) => state.loginSlice);
    const navigate = useNavigate();
    const folderRef = useRef<HTMLDivElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<WritePostType>({
        inputTag: "",
        tags: [],
        title: "",
        content: "",
    });
    const [showTag, setShowTag] = useState(false);

    const [folderOpen, setFolderOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState("폴더 선택");
    const [uploadCount, setUploadCount] = useState(0);
    const [exitPage, setExitPage] = useState(false);
    const handleFolderOpen = () => {
        setFolderOpen(prev => !prev);
    }

    const removeTag = (tag: string | null) => {
        setPost({...post, tags: post.tags.filter(prevTag => prevTag !== tag)});
    }
    const handleTag = (tag: string) => {
        if (!tag.endsWith(",")) {
            setPost({...post, inputTag: tag});
            return;
        }
        if (post.tags.includes(tag.substring(0, tag.length - 1))) {
            setPost({...post, inputTag: ""});
            return;
        }
        setPost({...post, tags: [...post.tags, post.inputTag], inputTag: ""});
    }

    const handleSubmit = () => {
        if (uploadCount > 0) {
            alert("업로드 중인 이미지가 있습니다. 잠시만 기다려주세요.");
            return;
        }

        setLoading(true);

        const urls: string[] = getImgUrls(post.content);

        createPost({
            title: post.title,
            content: post.content,
            tagNames: post.tags,
            urls: urls,
        })
            .then(() => {
                alert("작성되었습니다.");
                setExitPage(true);
                navigate(`/blog/${loginState.username}username`);
            })
            .catch((error) => alert(error.response.data.message))
            .finally(() => setLoading(false));
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (folderRef.current && !folderRef.current.contains(event.target as Node)) {
            setFolderOpen(false);
        }
    };

    // 뒤로가기 방지
    useBlocker(() => {
            return (!!post.title || !!post.content) &&
                exitPage &&
                !confirm("페이지를 이동하시겠습니까?\n\n작성중인 내용이 저장되지 않습니다.");
        }
    );

    // 새로고침 방지
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const folderData: FolderType[] = [
        {
            name: faker.lorem.words(),
            subFolders: [
                {name: faker.lorem.words()},
                {name: faker.lorem.words()}
            ]
        },
        {
            name: faker.lorem.words(),
        },
        {
            name: faker.lorem.words(),
            subFolders: [
                {name: faker.lorem.words()},
                {name: faker.lorem.words()},
                {name: faker.lorem.words()}
            ]
        },
    ];

    useEffect(() => {
        if (!loginState.isLogin) {
            alert("해당 페이지 이용에는 로그인이 필요합니다.");
            navigate("/login");
        }
    }, []);

    return (
        <BasicLayout>
            <div className="flex flex-col w-full">
                <div className="flex justify-start items-center">
                    <div ref={folderRef}
                         className="w-full relative flex justify-start text-gray-700 items-center text-sm font-normal">
                        <button
                            className="w-auto flex justify-between items-center gap-x-2 px-3 py-2 border border-gray-200 hover:bg-gray-50 hover:cursor-pointer"
                            onClick={handleFolderOpen}>
                            {selectedFolder}
                            <MdOutlineArrowDropDown/>
                        </button>
                        <div
                            className={`${folderOpen ? "" : "hidden"} absolute z-50 top-12 left-0 bg-white divide-y divide-gray-500 rounded-lg shadow-sm`}>
                            {folderData.map((folder) => {
                                if (!folder.subFolders) {
                                    return <div key={folder.name} className="py-2 w-auto text-sm">
                                        <button
                                            className="px-4 py-2 text-gray-700 text-start hover:bg-gray-100 w-full hover:cursor-pointer"
                                            onClick={() => {
                                                setSelectedFolder(folder.name);
                                                setFolderOpen(false);
                                            }}>
                                            {folder.name}
                                        </button>
                                    </div>
                                } else {
                                    return <div key={folder.name}
                                                className="flex flex-col items-start py-2 w-auto text-sm">
                                        <button
                                            className="px-4 py-2 text-gray-700 text-start border-gray-200 hover:bg-gray-100 w-full hover:cursor-pointer"
                                            onClick={() => {
                                                setSelectedFolder(folder.name);
                                                setFolderOpen(false);
                                            }}>
                                            {folder.name}
                                        </button>
                                        {folder.subFolders.map((subFolder: FolderType) =>
                                            <button
                                                key={subFolder.name}
                                                className="px-4 py-2 text-gray-700 text-start hover:bg-gray-100 w-full hover:cursor-pointer"
                                                onClick={() => {
                                                    setSelectedFolder(`${folder.name} > ${subFolder.name}`);
                                                    setFolderOpen(false);
                                                }}>
                                                {`${folder.name} > ${subFolder.name}`}
                                            </button>
                                        )}
                                    </div>;
                                }
                            })}
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-between items-center my-6">
                    <input value={post.title}
                           onChange={(e) => setPost({...post, title: e.target.value})}
                           placeholder={"제목을 입력해주세요."}
                           className="w-full py-2 font-jalnan text-2xl text-gray-900 border-b-2 border-white focus:outline-none focus:border-black"/>
                </div>
                <div className="relative z-10">
                    <div className="mb-8 flex flex-row flex-wrap items-center gap-4">
                        {post.tags.map((tag, i) =>
                            <button key={i}
                                    className="flex justify-between items-center gap-x-2 border border-lime-50 shadow text-lime-700 rounded-4xl px-4 py-2 font-semibold text-sm transform transition-all hover:bg-lime-50 hover:cursor-pointer"
                                    onClick={(event) => removeTag(event.currentTarget.textContent)}>
                                {tag}
                                <MdOutlineClear/>
                            </button>)}
                        <input className="flex-1 text-lg focus:outline-none"
                               type="text" placeholder="태그를 입력하세요" value={post.inputTag}
                               onChange={(event) => handleTag(event.target.value)}
                               onFocus={() => setShowTag(true)}
                               onBlur={() => setShowTag(false)}/>
                    </div>
                    {showTag && <div
                        className="absolute -bottom-6 left-0 flex flex-col rounded-md bg-gray-700 text-white w-[calc(302px)] px-4 py-2 text-sm">
                        <span className="pb-1">쉼표를 입력하여 태그를 등록할 수 있습니다.</span>
                    </div>}
                </div>
                <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    init={{
                        min_height: 400,
                        max_height: 4000,
                        plugins: 'anchor autolink autoresize charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                        autoresize: true,
                        menubar: false,
                        statusbar: false,
                        inline_boundaries: false,
                        toolbar: 'undo redo | h1 h2 h3 h4 | bold italic underline strikethrough blockquote | alignjustify alignleft aligncenter alignright lineheight | checklist numlist bullist indent outdent',
                        placeholder: "내용을 작성해주세요.",
                        file_picker_types: "image",
                        images_upload_handler: async (blobInfo) => {
                            setUploadCount(prev => prev + 1);
                            const res = await uploadImage(blobInfo);
                            setUploadCount(prev => prev - 1);
                            return res.data.url;
                        }
                    }}
                    value={post.content}
                    onEditorChange={(content) => setPost({...post, content: content})}
                />
                <div className="flex justify-end items-center w-full mt-4">
                    <FillButton text={"게시하기"} onClick={handleSubmit}/>
                </div>
            </div>
            <LoadingLayout loading={loading}/>
        </BasicLayout>
    );
}

export default WritePage;