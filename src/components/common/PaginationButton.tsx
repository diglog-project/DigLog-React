import {PageResponse} from "../../common/types/common.tsx";
import {MdArrowLeft, MdArrowRight} from "react-icons/md";
import {useEffect, useState} from "react";

function PaginationButton({pageInfo, setPage}: {
    pageInfo: PageResponse,
    setPage: (page: number) => void,
}) {

    const paginationSize = 10;

    const [pageList, setPageList] = useState<number[]>([]);
    const [startPage, setStartPage] = useState(0);

    const getArray = (start: number, size: number) => {
        return Array.from({length: size}, (_, index) => index + start);
    }

    useEffect(() => {
        if (pageInfo.totalPages < startPage + paginationSize) {
            setPageList(getArray(startPage, pageInfo.totalPages - startPage));
        } else {
            setPageList(getArray(startPage, paginationSize));
        }
    }, [startPage]);

    return (
        <div className="flex justify-center space-x-1">
            <button
                onClick={() => {
                    if (startPage !== 0) {
                        setStartPage(startPage - paginationSize);
                    }
                }}
                className="rounded-full py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-lime-400 hover:border-lime-400 hover:cursor-pointer ml-2">
                <MdArrowLeft className="size-6"/>
            </button>
            {pageList.map((page) => (
                <button
                    key={page}
                    onClick={() => {
                        setPage(page)
                    }}
                    className="min-w-9 rounded-full bg-white py-2 px-3.5 border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg focus:bg-lime-400 focus:shadow-none active:bg-lime-400 hover:bg-lime-400 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:cursor-pointer ml-2">
                    {page + 1}
                </button>
            ))}
            <button
                onClick={() => {
                    if (pageInfo.totalPages > startPage + paginationSize) {
                        setStartPage(startPage + paginationSize);
                    }
                }}
                className="min-w-9 rounded-full py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-lime-400 hover:border-lime-400 hover:cursor-pointer ml-2">
                <MdArrowRight className="size-6"/>
            </button>
        </div>
    );
}

export default PaginationButton;