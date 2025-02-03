import {ReactNode} from "react";
import Header from "../components/common/Header.tsx";

function BasicLayout({children}: { children: ReactNode }) {

    return (
        <main className="w-full h-screen">
            <Header/>
            <div className="mx-auto px-8 lg:px-12 2xl:px-16 max-w-screen-2xl">
                {children}
            </div>
        </main>
    );
}

export default BasicLayout;