import ModalLayout from "../../layout/ModalLayout.tsx";
import {useState} from "react";
import {FillButton} from "../common/FillButton.tsx";
import {CategoryType} from "../../pages/setting/SettingPage.tsx";
import {TextButton} from "../common/TextButton.tsx";
import {MdOutlineArrowDropDown} from "react-icons/md";

function CategoryAddModal({categories, setShowCategoryAddModal}: {
    categories: CategoryType[],
    setShowCategoryAddModal: (modal: boolean) => void
}) {

    const [inputCategory, setInputCategory] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("블로그");

    return (
        <ModalLayout>
            <div className="flex flex-col gap-y-4">
                <p>카테고리 추가</p>
                <button
                    className="w-auto flex justify-between items-center gap-x-2 px-3 py-2 border border-gray-200 hover:bg-gray-50 hover:cursor-pointer"
                    onClick={() => setCategoryOpen(prev => !prev)}>
                    {selectedCategory}
                    <MdOutlineArrowDropDown/>
                </button>
                <div
                    className={`${categoryOpen ? "" : "hidden"} absolute z-50 top-12 left-0 bg-white divide-y divide-gray-500 rounded-lg shadow-sm`}>
                    <div className="py-2 w-auto text-sm">
                        <button
                            className="px-4 py-2 text-gray-700 text-start hover:bg-gray-100 w-full hover:cursor-pointer"
                            onClick={() => {
                                setSelectedCategory("블로그");
                                setCategoryOpen(false);
                            }}>
                            블로그
                        </button>
                    </div>
                    {categories.map((category) => {
                        if (!category.subCategories) {
                            return <div key={category.name} className="py-2 w-auto text-sm">
                                <button
                                    className="px-4 py-2 text-gray-700 text-start hover:bg-gray-100 w-full hover:cursor-pointer"
                                    onClick={() => {
                                        setSelectedCategory(category.name);
                                        setCategoryOpen(false);
                                    }}>
                                    {category.name}
                                </button>
                            </div>
                        } else {
                            return <div key={category.name}
                                        className="flex flex-col items-start py-2 w-auto text-sm">
                                <button
                                    className="px-4 py-2 text-gray-700 text-start border-gray-200 hover:bg-gray-100 w-full hover:cursor-pointer"
                                    onClick={() => {
                                        setSelectedCategory(category.name);
                                        setCategoryOpen(false);
                                    }}>
                                    {category.name}
                                </button>
                                {category.subCategories.map((subCategory: CategoryType) =>
                                    <button
                                        key={subCategory.name}
                                        className="px-4 py-2 text-gray-700 text-start hover:bg-gray-100 w-full hover:cursor-pointer"
                                        onClick={() => {
                                            setSelectedCategory(`${category.name} > ${subCategory.name}`);
                                            setCategoryOpen(false);
                                        }}>
                                        {`${category.name} > ${subCategory.name}`}
                                    </button>
                                )}
                            </div>;
                        }
                    })}
                </div>
                <input type="text"
                       value={inputCategory}
                       onChange={(e) => setInputCategory(e.target.value)}
                       placeholder="카테고리 이름을 입력해주세요."
                       className="border border-gray-400 p-4 font-bold"/>
                <div className="flex justify-between items-center">
                    <TextButton text={"취소"} onClick={() => setShowCategoryAddModal(false)}/>
                    <FillButton text={"카테고리 추가"} onClick={() => {
                        alert("카테고리가 추가되었습니다.");
                        setShowCategoryAddModal(false);
                    }}/>
                </div>
            </div>
        </ModalLayout>
    );
}

export default CategoryAddModal;