import { ReactNode } from "react";
import Header from "../components/common/Header.tsx";
import Footer from "../components/common/Footer.tsx";

function BasicLayout({ children, center }: { children: ReactNode, center?: boolean }) {

    return (
        <main className="w-full h-screen">
            <Header />
            <div className={`flex ${(center) ? "justify-center items-center" : "justify-start items-start"} mx-auto px-8 lg:px-12 2xl:px-16 py-8 max-w-screen-2xl min-h-[calc(100vh-156px)]`}>
                {children}
            </div>
            <Footer />
        </main>
    );
}

export default BasicLayout;