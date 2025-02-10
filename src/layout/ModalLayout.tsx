import {ReactNode} from "react";

function ModalLayout({children}: { children: ReactNode }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="absolute inset-0 z-20 bg-black opacity-50"/>
            <div className="z-50 max-w-240 w-full shadow-lg bg-white rounded-2xl p-8">
                {children}
            </div>
        </div>
    );
}

export default ModalLayout;