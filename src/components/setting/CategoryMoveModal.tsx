import {CategoryType} from "../../pages/setting/SettingPage.tsx";
import {FillButton} from "../common/FillButton.tsx";
import {useState} from "react";
import {TextButton} from "../common/TextButton.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.tsx";

function CategoryMoveModal({selectedCategory, categories, handleCategoryMove, setShowModal}: {
    selectedCategory: CategoryType | null,
    categories: CategoryType[],
    handleCategoryMove: (categoryId: string) => void
    setShowModal: (showModal: boolean) => void,
}) {

    const loginState = useSelector((state: RootState) => state.loginSlice);

    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const handleCategoryChange = () => {
        handleCategoryMove(selectedCategoryId);

        setShowModal(false);
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="absolute inset-0 z-20 bg-black opacity-50" />
            <div className="z-50 max-w-240 w-full shadow-lg bg-white rounded-2xl p-8 flex flex-col gap-y-4">
                <p className="font-bold mb-8">
                    "{selectedCategory?.name}" 카테고리를 이동할 곳을 골라주세요.
                </p>
                <button
                    className={`${"top" === selectedCategoryId && "bg-lime-300"} border border-gray-400 p-2 text-start hover:bg-lime-300 hover:cursor-pointer`}
                    onClick={() => setSelectedCategoryId("top")}>
                    {loginState.username}의 블로그
                </button>
                {categories.map(category => (
                    <button key={category.id}
                            className={`${category.id === selectedCategoryId && "bg-lime-300"} ml-8 border border-gray-400 p-2 text-start hover:bg-lime-300 hover:cursor-pointer`}
                            onClick={() => setSelectedCategoryId(category.id)}>
                        {category.name}
                    </button>
                ))}
                <div className="flex justify-between items-center">
                    <TextButton text={"취소"} onClick={() => setShowModal(false)}/>
                    <FillButton text={"이동"} onClick={handleCategoryChange}/>
                </div>
            </div>
        </div>
    );
}

export default CategoryMoveModal;