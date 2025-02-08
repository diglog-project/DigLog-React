import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {SortableContext} from "@dnd-kit/sortable";
import {FillButton} from "../../components/common/FillButton.tsx";
import {CategoryType} from "./BlogSettingPage.tsx";
import CategoryCard from "../../components/blog/CategoryCard.tsx";

function CategorySettingPage({categories, handleDragEnd, isHover, handleHover, submitCategoryChange}: {
    categories: CategoryType[],
    handleDragEnd: (event: DragEndEvent) => void,
    isHover: boolean,
    handleHover: (hover: boolean) => void,
    submitCategoryChange: () => void,
}) {

    return (
        <div>
            <p className="font-semibold text-xl my-4">카테고리 관리</p>
            <div className="flex flex-col w-full">
                <DndContext modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}>
                    <SortableContext items={categories}>
                        {categories.map((category) => (
                            <div key={category.id}>
                                <CategoryCard category={category} handleDrag={handleDragEnd} isHover={isHover}
                                              handleHover={handleHover}/>
                            </div>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
            <div className="flex justify-between w-full my-4">
                <div></div>
                <FillButton text={"변경사항 저장"} onClick={submitCategoryChange} addStyle={"font-normal"}/>
            </div>
        </div>
    );
}

export default CategorySettingPage;