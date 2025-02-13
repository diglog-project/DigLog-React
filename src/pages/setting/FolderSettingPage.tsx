import {faker} from "@faker-js/faker/locale/ko";
import {useState} from "react";
import {FolderResponse} from "../../common/types/blog.tsx";
import {FillButton} from "../../components/common/FillButton.tsx";
import {TextButton} from "../../components/common/TextButton.tsx";

function FolderSettingPage() {

    const folderData: FolderResponse[] = [
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 1,
            order: 1,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: "DigLog의 블로그",
            depth: 0,
            order: 0,
            parentOrder: -1,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 1,
            order: 0,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 1,
            order: 3,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 0,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 1,
            parentOrder: 1,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 2,
            parentOrder: 1,
        },

        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 0,
            parentOrder: 3,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 1,
            order: 2,
            parentOrder: 0,
        },
        {
            id: crypto.randomUUID(),
            title: faker.lorem.words(),
            depth: 2,
            order: 0,
            parentOrder: 1,
        },
    ];

    const sortFolders = (folders: FolderResponse[]) => {
        const result: FolderResponse[] = [];

        const rootFolder = folders.findIndex(folder => folder.depth === 0);
        result.push(folders[rootFolder]);

        const mainFolders = folders.filter((folder) =>
            folder.depth === 1 && folder.parentOrder === 0)
            .sort((a, b) => a.order - b.order);

        mainFolders.forEach((folder) => {
            result.push(folder);

            const subFolders = folders.filter((subFolder) =>
                subFolder.depth === 2 && subFolder.parentOrder === folder.order)
                .sort((a, b) => a.order - b.order);
            result.push(...subFolders);
        });

        return result;
    };

    const [folders, setFolders] = useState<FolderResponse[]>(sortFolders(folderData));

    const addFolder = (parentFolder: FolderResponse, title: string) => {
        if (parentFolder.depth >= 2) {
            return;
        }

        const subFolders = folders.filter(folder =>
            folder.depth === parentFolder.depth + 1 && folder.parentOrder === parentFolder.order);
        const maxOrder = subFolders.reduce((max, folder) => {
            return folder.order > max ? folder.order : max;
        }, -1);

        const newFolder: FolderResponse = {
            id: crypto.randomUUID(),
            title: title,
            depth: parentFolder.depth + 1,
            order: maxOrder + 1,
            parentOrder: parentFolder.order,
        };

        setFolders(sortFolders([...folders, newFolder]));
    }

    const moveFolder = (moveFolder: FolderResponse, targetFolder: FolderResponse) => {
        // maxDepth 초과하는 경우 return
        if (targetFolder.depth === 2 && moveFolder.depth === 1 &&
            folders.findIndex(folder => folder.depth === 2 && folder.parentOrder === moveFolder.order) !== -1) {
            alert("하위 폴더를 이동한 후에 이동해주세요.");
            return;
        }

        const moveFolders: FolderResponse[] = [];
        const anotherFolders: FolderResponse[] = [];

        // 이동할 폴더 분리
        folders.forEach(folder => {
            if (folder.depth === moveFolder.depth && folder.parentOrder === moveFolder.parentOrder && folder.order === moveFolder.order) {
                moveFolders.push({
                    ...folder,
                    depth: targetFolder.depth,
                    order: targetFolder.order,
                    parentOrder: targetFolder.parentOrder,
                });
            } else if (folder.depth === moveFolder.depth + 1 && folder.parentOrder === moveFolder.order) {
                moveFolders.push({
                    ...folder,
                    parentOrder: targetFolder.order,
                });
            } else {
                anotherFolders.push(folder);
            }
        });

        // 앞으로 이동하는 폴더 order--
        anotherFolders.forEach(folder => {
            if (folder.depth === moveFolder.depth && folder.parentOrder === moveFolder.parentOrder && folder.order > moveFolder.order) {
                folder.order--;
            } else if (folder.depth === moveFolder.depth + 1 && folder.parentOrder > moveFolder.order) {
                folder.order--;
            }
        });

        // 뒤로 이동하는 폴더 뒤의 order++
        anotherFolders.forEach(folder => {
            if (folder.depth === targetFolder.depth && folder.parentOrder === targetFolder.parentOrder && folder.order >= targetFolder.order) {
                folder.order++;
            } else if (folder.depth === targetFolder.depth + 1 && folder.parentOrder >= targetFolder.order) {
                folder.parentOrder++;
            }
        });

        setFolders(sortFolders([...anotherFolders, ...moveFolders]));
    }

    const handleSubmit = () => {
        alert("변경사항이 적용되었습니다.");
    }

    return (
        <div>
            <p className="font-semibold text-xl my-4">폴더 관리</p>
            {folders.map((folder: FolderResponse) => (
                <div key={folder.id}
                     className={`ml-${folder.depth * 8 - 8} ${folder.depth === 0 && "hidden"} flex justify-between items-center border h-12 px-4 my-4 text-sm`}>
                    depth: {folder.depth} parentOrder : {folder.parentOrder} order : {folder.order} {folder.title}
                    <div className="flex justify-end items-center gap-x-2">
                        {folder.depth <= 1 &&
                            <TextButton text={"추가"} onClick={() => addFolder(folder, faker.lorem.words())}
                                        addStyle={"text-xs"}/>}
                        <TextButton text={"1, 1, 0 으로 이동"} onClick={() => moveFolder(folder, {
                            id: "",
                            title: "",
                            depth: 1,
                            parentOrder: 0,
                            order: 1,
                        })} addStyle={"text-xs"}/>
                    </div>
                </div>
            ))}
            <button className="w-full border h-12 px-4 my-4 text-sm hover:cursor-pointer"
                    onClick={() => addFolder({
                        id: crypto.randomUUID(),
                        title: "",
                        depth: 0,
                        parentOrder: -1,
                        order: 0
                    }, faker.lorem.words())}>
                폴더 추가
            </button>
            <div className="flex justify-end">
                <FillButton text={"변경사항 저장"} onClick={handleSubmit} addStyle={"text-sm"}/>
            </div>
        </div>
    );
}

export default FolderSettingPage;