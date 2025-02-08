import BasicLayout from "../../layout/BasicLayout.tsx";
import {useState} from "react";
import {faker} from "@faker-js/faker/locale/ko";
import {DragEndEvent} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import {useNavigate} from "react-router-dom";
import CategorySettingPage from "./CategorySettingPage.tsx";
import PostSettingPage from "./PostSettingPage.tsx";

export interface CategoryType {
    id: string;
    name: string;
    subCategories?: CategoryType[];
}

function BlogSettingPage() {

    const navigate = useNavigate();

    const tabList = ["카테고리", "게시글"];
    const categoryData: CategoryType[] = [
        {
            id: "1",
            name: faker.lorem.words(),
            subCategories: [
                {id: "4", name: faker.lorem.words()},
                {id: "5", name: faker.lorem.words()}
            ]
        },
        {
            id: "2",
            name: faker.lorem.words(),
        },
        {
            id: "3",
            name: faker.lorem.words(),
            subCategories: [
                {id: "6", name: faker.lorem.words()},
                {id: "7", name: faker.lorem.words()},
                {id: "8", name: faker.lorem.words()}
            ]
        },
    ];

    const [selectedTab, setSelectedTab] = useState("카테고리");
    const [categories, setCategories] = useState<CategoryType[]>(categoryData);
    const [isHover, setIsHover] = useState(false);

    const handleHover = (hover: boolean) => {
        setIsHover(hover);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over || active.id === over.id) {
            return;
        }

        let categoryIndex = -1;
        let oldIndex = -1;
        let newIndex = -1;

        oldIndex = categories.findIndex(category => category.id === active.id);
        newIndex = categories.findIndex(category => category.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            setCategories(category => {
                return arrayMove(category, oldIndex, newIndex);
            });
            return;
        }

        for (const category of categories) {
            if (category.subCategories) {
                oldIndex = category.subCategories.findIndex(category => category.id === active.id);
                newIndex = category.subCategories.findIndex(category => category.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    categoryIndex = categories.indexOf(category);
                    break;
                }
            }
        }

        if (categoryIndex !== -1 && oldIndex !== -1 && newIndex !== -1) {
            setCategories(currentCategories => {
                const updatedSubCategories = [...currentCategories[categoryIndex].subCategories!];
                const [movedCategory] = updatedSubCategories.splice(oldIndex, 1);
                updatedSubCategories.splice(newIndex, 0, movedCategory);

                const updatedCategories = [...currentCategories];
                updatedCategories[categoryIndex] = {...updatedCategories[categoryIndex], subCategories: updatedSubCategories};

                return updatedCategories;
            });
        }
    }

    const submitCategoryChange = () => {
        if (confirm("변경사항을 저장하시겠습니까?")) {
            alert("저장되었습니다.");
            navigate(0);
        }
    }

    return (
        <BasicLayout>
            <div className="flex w-full gap-x-4">
                <div
                    className="w-52 h-full flex flex-col justify-start items-start">
                    <ul className="w-full flex flex-col gap-y-1.5 flex-wrap">
                        {tabList.map((tab) =>
                            <li key={tab}>
                                <button
                                    onClick={() => setSelectedTab(tab)}
                                    className="text-left w-full p-2 my-1 hover:bg-gray-200 hover:cursor-pointer">
                                    {tab}
                                </button>
                            </li>)}
                    </ul>
                </div>
                {(selectedTab === "카테고리") &&
                    <div className="border-l border-gray-200 w-full ps-8">
                        <CategorySettingPage
                            categories={categories}
                            handleDragEnd={handleDragEnd}
                            isHover={isHover}
                            handleHover={handleHover}
                            submitCategoryChange={submitCategoryChange}/>
                    </div>}
                {(selectedTab === "게시글") &&
                    <div className="border-l border-gray-200 w-full ps-8">
                        <PostSettingPage/>
                    </div>}
            </div>
        </BasicLayout>
    );
}

export default BlogSettingPage;