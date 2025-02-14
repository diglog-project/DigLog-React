import {ReactNode, Ref} from "react";

function ModalLayout({children, customRef, addStyle}: {
    children: ReactNode,
    customRef?: Ref<HTMLDivElement>,
    addStyle?: string,
}) {
    return (
        <div className={"fixed inset-0 flex justify-center items-center px-8"}>
            <div className="absolute inset-0 z-20 opacity-50"/>
            <div ref={customRef} className={`${addStyle} z-50 max-w-240 w-full bg-white shadow-lg rounded-2xl p-8`}>
                {children}
            </div>
        </div>
    );
}

export default ModalLayout;