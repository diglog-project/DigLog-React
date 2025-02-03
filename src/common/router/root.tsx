import {createBrowserRouter} from "react-router-dom";
import {Suspense} from "react";
import {Loading, Login, Main} from "./page.tsx";
import postRouter from "./postRouter.tsx";
import blogRouter from "./blogRouter.tsx";

const root = createBrowserRouter([
    {
        path: '',
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: '/login',
        element: <Suspense fallback={Loading}><Login/></Suspense>
    },
    {
        path: '/post',
        children: postRouter()
    },
    {
        path: '/blog',
        children: blogRouter()
    },
]);

export default root;