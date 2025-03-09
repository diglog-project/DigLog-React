import {Suspense} from "react";
import {Blog, BlogTag, Loading} from "./page.tsx";

const blogRouter = () => {

    return [
        {
            path: ':username',
            element: <Suspense fallback={Loading}><Blog/></Suspense>
        },
        {
            path: ':username/tag',
            element: <Suspense fallback={Loading}><BlogTag/></Suspense>
        },
    ];
}

export default blogRouter;