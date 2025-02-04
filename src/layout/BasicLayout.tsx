import {ReactNode} from "react";
import Header from "../components/common/Header.tsx";
import Footer from "../components/common/Footer.tsx";

function BasicLayout({children}: { children: ReactNode }) {

    return (
        <main className="w-full h-screen">
            <Header/>
            <div className="mx-auto px-8 lg:px-12 2xl:px-16 max-w-screen-2xl min-h-[calc(100vh-224px)]">
                {children}
            </div>
            <Footer/>
        </main>
    );
}

export default BasicLayout;