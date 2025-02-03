import {Suspense} from "react";
import {Blog, Loading} from "./page.tsx";

const blogRouter = () => {

    return [
        {
            path: ':username',
            element: <Suspense fallback={Loading}><Blog/></Suspense>
        }
    ];
}

export default blogRouter;