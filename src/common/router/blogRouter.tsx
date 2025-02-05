import {Suspense} from "react";
import {Blog, BlogSetting, Loading} from "./page.tsx";

const blogRouter = () => {

    return [
        {
            path: ':username',
            element: <Suspense fallback={Loading}><Blog/></Suspense>
        },
        {
            path: ':username/setting',
            element: <Suspense fallback={Loading}><BlogSetting/></Suspense>
        },
    ];
}

export default blogRouter;