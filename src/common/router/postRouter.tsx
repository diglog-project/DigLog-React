import {Suspense} from "react";
import {Loading, Post} from "./page.tsx";

const postRouter = () => {

    return [
        {
            path: ':id',
            element: <Suspense fallback={Loading}><Post/></Suspense>
        },
    ];
}

export default postRouter;