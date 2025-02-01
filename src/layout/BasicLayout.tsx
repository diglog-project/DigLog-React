import {ReactNode} from "react";
import Header from "../components/common/Header.tsx";

function BasicLayout({children}: { children: ReactNode }) {

    return (
        <main className={"w-full h-auto"}>
            <div className="mx-auto md:max-w-screen-md lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
                <Header/>
                {children}
            </div>
        </main>
    );
}

export default BasicLayout;