import {PageResponse} from "../../common/types/common.tsx";
import {
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight
} from "react-icons/md";
import {useEffect, useState} from "react";

function PaginationButton({pageInfo, setPage}: {
    pageInfo: PageResponse,
    setPage: (page: number) => void,
}) {

    const paginationSize = 5;

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
    }, [startPage, pageInfo]);

    return (
        <nav className="flex justify-center items-center gap-x-1" aria-label="Pagination">
            <button type="button"
                    className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex jusify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                    hidden={!(startPage !== 0)}
                    onClick={() => {
                        if (startPage !== 0) {
                            setStartPage(startPage - paginationSize);
                            setPage(startPage - paginationSize);
                        }
                    }}
                    aria-label="Previous">
                <MdKeyboardDoubleArrowLeft size={16}/>
                <span className="sr-only">Previous</span>
            </button>
            <div className="flex items-center gap-x-1">
                {pageList.map(currentPage =>
                    <button key={currentPage}
                            type="button"
                            className={`
                            ${currentPage === pageInfo.number ? "bg-gray-200 focus:bg-gray-300 " : "hover:bg-gray-100 focus:bg-gray-100"}
                            min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 py-2 px-3 text-sm rounded-lg hover:cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none`}
                            onClick={() => setPage(currentPage)}
                            aria-current="page">
                        {currentPage + 1}
                    </button>)}
            </div>
            <button type="button"
                    className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex jusify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 hover:cursor-pointer focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                    hidden={!(pageInfo.totalPages > startPage + paginationSize)}
                    onClick={() => {
                        if (pageInfo.totalPages > startPage + paginationSize) {
                            setStartPage(startPage + paginationSize);
                            setPage(startPage + paginationSize);
                        }
                    }}
                    aria-label="Next">
                <span className="sr-only">Next</span>
                <MdKeyboardDoubleArrowRight size={16}/>
            </button>
        </nav>
        // <div className="flex justify-center space-x-1">
        //     <button
        //         onClick={() => {
        //             if (startPage !== 0) {
        //                 setStartPage(startPage - paginationSize);
        //             }
        //         }}
        //         className="rounded-full py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-lime-400 hover:border-lime-400 hover:cursor-pointer ml-2">
        //         <MdArrowLeft className="size-6"/>
        //     </button>
        //     {pageList.map((page) => (
        //         <button
        //             key={page}
        //             onClick={() => {
        //                 setPage(page)
        //             }}
        //             className={`${pageInfo.number === page ? "bg-lime-400" : ""} min-w-9 rounded-full bg-white py-2 px-3.5 border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg focus:bg-lime-400 focus:shadow-none active:bg-lime-400 hover:bg-lime-400 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:cursor-pointer ml-2`}>
        //             {page + 1}
        //         </button>
        //     ))}
        //     <button
        //         onClick={() => {
        //             if (pageInfo.totalPages > startPage + paginationSize) {
        //                 setStartPage(startPage + paginationSize);
        //             }
        //         }}
        //         className="min-w-9 rounded-full py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-lime-400 hover:border-lime-400 hover:cursor-pointer ml-2">
        //         <MdArrowRight className="size-6"/>
        //     </button>
        // </div>
    );


}

export default PaginationButton;