import {CategoryType} from "../../pages/setting/SettingPage.tsx";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {MdOutlineMenu} from "react-icons/md";
import {TextButton} from "../common/TextButton.tsx";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {useState} from "react";
import {FillButton} from "../common/FillButton.tsx";

function CategoryCard({setSelectedCategory, category, setShowModal, handleDrag, isHover, handleHover, isSub}: {
    setSelectedCategory: (category: CategoryType) => void,
    category: CategoryType,
    setShowModal: (modal: boolean) => void,
    handleDrag?: (event: DragEndEvent) => void,
    isHover: boolean,
    handleHover: (hover: boolean) => void,
    isSub?: boolean
}) {

    const [isEdit, setIsEdit] = useState(false);
    const [categoryNameInput, setCategoryNameInput] = useState(category.name);

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: category.id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const handleCategoryNameChange = () => {
        category.name = categoryNameInput;
        setIsEdit(false);
    }

    return (
        <div ref={setNodeRef} style={style}
             className={`${isSub ? "hover:ring ml-12" : isHover ? " hover:ring-0 " : " hover:ring "} group flex flex-col border border-gray-200 font-bold gap-x-2 px-4 my-1`}>
            <div className="flex justify-between items-center gap-x-4"
                 onMouseEnter={() => {
                     if (isSub) {
                         handleHover(true);
                     }
                 }}
                 onMouseLeave={() => {
                     if (isSub) {
                         handleHover(false);
                     }
                 }}>
                <button {...attributes} {...listeners}
                        className="hover:cursor-move">
                    <MdOutlineMenu className="size-6"/>
                </button>
                {(isEdit)
                    ? <input
                        className="w-full p-2 border"
                        type="text"
                        value={categoryNameInput}
                        onChange={(e) => {
                            setCategoryNameInput(e.target.value)
                        }}/>
                    : <p className="flex-1 py-4">{category.name}</p>}
                <div className={`flex justify-end items-center gap-x-4`}>
                    {(isSub && !isEdit) &&
                        <TextButton
                            text={"이동"}
                            addStyle={"font-normal text-sm hover:bg-gray-200"}
                            onClick={() => {
                                setSelectedCategory(category);
                                setShowModal(true);
                            }}/>}
                    {(isEdit)
                        ? <FillButton
                            text={"변경"}
                            onClick={handleCategoryNameChange}
                            addStyle={"w-16 font-normal text-sm"}/>
                        : <TextButton
                            text={"수정"}
                            addStyle={"font-normal text-sm hover:bg-gray-200"}
                            onClick={() => setIsEdit(true)}/>}
                </div>
            </div>
            {category.subCategories && (
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDrag}>
                    <SortableContext items={category.subCategories}>
                        {category.subCategories.map((subCategory) => (
                            <CategoryCard
                                key={subCategory.id}
                                setSelectedCategory={setSelectedCategory}
                                category={subCategory}
                                setShowModal={setShowModal}
                                isSub={true} isHover={isHover}
                                handleHover={handleHover}/>
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}

export default CategoryCard;