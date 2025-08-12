import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FolderType } from '../../common/types/blog.tsx';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FillButton } from '../common/FillButton.tsx';
import { MdOutlineMenu } from 'react-icons/md';
import { TextButton } from '../common/TextButton.tsx';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useEffect, useRef } from 'react';
import * as React from 'react';

function FolderCardList({
    folders,
    depth = 0,
    editFolderId,
    editFolderTitle,
    setEditFolderId,
    setEditFolderTitle,
    handleEdit,
    addFolder,
    handleOnDragEnd,
    handleDelete,
    setSelectedFolder,
    setOpenMoveModal,
}: {
    folders: FolderType[];
    depth?: number;
    editFolderId: string;
    editFolderTitle: string;
    setEditFolderId: (editFolderId: string) => void;
    setEditFolderTitle: (editFolderTitle: string) => void;
    handleEdit: (editFolder: FolderType) => void;
    addFolder: (targetFolder: FolderType) => void;
    handleOnDragEnd: (event: DragEndEvent) => void;
    handleDelete: (deleteFolder: FolderType) => void;
    setOpenMoveModal: (openMoveModal: boolean) => void;
    setSelectedFolder: (selectedFolder: FolderType) => void;
}) {
    return (
        <DndContext onDragEnd={handleOnDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={folders} strategy={verticalListSortingStrategy}>
                {folders.map((folder: FolderType) => (
                    <FolderCard
                        key={folder.id}
                        folder={folder}
                        depth={depth}
                        editFolderId={editFolderId}
                        editFolderTitle={editFolderTitle}
                        setEditFolderId={setEditFolderId}
                        setEditFolderTitle={setEditFolderTitle}
                        handleEdit={handleEdit}
                        addFolder={addFolder}
                        handleOnDragEnd={handleOnDragEnd}
                        handleDelete={handleDelete}
                        setOpenMoveModal={setOpenMoveModal}
                        setSelectedFolder={setSelectedFolder}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
}

function FolderCard({
    folder,
    depth,
    editFolderId,
    editFolderTitle,
    setEditFolderId,
    setEditFolderTitle,
    handleEdit,
    addFolder,
    handleOnDragEnd,
    handleDelete,
    setSelectedFolder,
    setOpenMoveModal,
}: {
    folder: FolderType;
    depth: number;
    editFolderId: string;
    editFolderTitle: string;
    setEditFolderId: (editFolderId: string) => void;
    setEditFolderTitle: (editFolderTitle: string) => void;
    handleEdit: (editFolder: FolderType) => void;
    addFolder: (targetFolder: FolderType) => void;
    handleOnDragEnd: (event: DragEndEvent) => void;
    handleDelete: (deleteFolder: FolderType) => void;
    setOpenMoveModal: (openMoveModal: boolean) => void;
    setSelectedFolder: (selectedFolder: FolderType) => void;
}) {
    const folderTitleRef = useRef<HTMLInputElement>(null);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: folder.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    useEffect(() => {
        if (folder.id === editFolderId) {
            folderTitleRef.current?.focus();
        }
    }, [editFolderId]);

    const handleEditTitleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }

        handleEditTitle();
    };

    const handleEditTitle = () => {
        handleEdit({ ...folder, title: editFolderTitle });
    };

    return (
        <div key={folder.id} ref={setNodeRef} style={style} className='flex flex-col justify-start items-center'>
            <div className='w-full flex justify-between items-center h-16 px-4 my-0.5 border border-gray-300 hover:border-gray-400 text-sm'>
                {folder.id === editFolderId ? (
                    <div className='w-full flex justify-between items-center gap-x-4'>
                        <input
                            className={'flex-1 font-bold border p-2'}
                            value={editFolderTitle}
                            onChange={e => setEditFolderTitle(e.target.value)}
                            onKeyDown={handleEditTitleEnter}
                            ref={folderTitleRef}
                            placeholder='폴더 이름'
                        />
                        <div className='flex items-center gap-x-2'>
                            <FillButton
                                text={'취소'}
                                onClick={() => setEditFolderId('')}
                                addStyle={'!bg-gray-400 hover:brightness-110'}
                            />
                            <FillButton
                                text={'수정'}
                                onClick={handleEditTitle}
                                addStyle={`${folder.title === editFolderTitle && 'opacity-50 hover:!cursor-auto'}`}
                                disabled={folder.title === editFolderTitle}
                            />
                        </div>
                    </div>
                ) : (
                    <div className='w-full flex justify-between items-center '>
                        <div className='flex items-center gap-x-2'>
                            <MdOutlineMenu
                                {...attributes}
                                {...listeners}
                                className='hover:cursor-pointer text-gray-600'
                            />
                            <p className='ml-2'>{folder.title}</p>
                            <p className='text-xs font-light'>({folder.postCount})</p>
                        </div>
                        <div className='flex justify-end items-center'>
                            {depth !== 2 && (
                                <TextButton
                                    text={'추가'}
                                    onClick={() => addFolder(folder)}
                                    addStyle={'text-xs hover:text-lime-600'}
                                />
                            )}
                            <TextButton
                                text={'수정'}
                                onClick={() => {
                                    setEditFolderId(folder.id);
                                    setEditFolderTitle(folder.title);
                                }}
                                addStyle={'text-xs hover:text-lime-600'}
                            />
                            <TextButton
                                text={'삭제'}
                                onClick={() => {
                                    handleDelete(folder);
                                }}
                                addStyle={'text-xs hover:text-lime-600'}
                            />
                            <TextButton
                                text={'이동'}
                                onClick={() => {
                                    setOpenMoveModal(true);
                                    setSelectedFolder(folder);
                                }}
                                addStyle={'text-xs hover:text-lime-600'}
                            />
                        </div>
                    </div>
                )}
            </div>
            {folder.subFolders.length > 0 && (
                <div className='pl-6 w-full'>
                    <FolderCardList
                        key={`${folder.id}_sub`}
                        folders={folder.subFolders}
                        depth={depth + 1}
                        editFolderId={editFolderId}
                        editFolderTitle={editFolderTitle}
                        setEditFolderId={setEditFolderId}
                        setEditFolderTitle={setEditFolderTitle}
                        handleEdit={handleEdit}
                        addFolder={addFolder}
                        handleOnDragEnd={handleOnDragEnd}
                        handleDelete={handleDelete}
                        setOpenMoveModal={setOpenMoveModal}
                        setSelectedFolder={setSelectedFolder}
                    />
                </div>
            )}
        </div>
    );
}

export default FolderCardList;
