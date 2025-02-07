import {createBrowserRouter} from "react-router-dom";
import {Suspense} from "react";
import {Loading, Login, Main, Profile, Search, Write} from "./page.tsx";
import postRouter from "./postRouter.tsx";
import blogRouter from "./blogRouter.tsx";
import signupRouter from "./signupRouter.tsx";

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
        path: '/profile',
        element: <Suspense fallback={Loading}><Profile/></Suspense>
    },
    {
        path: '/search',
        element: <Suspense fallback={Loading}><Search/></Suspense>
    },
    {
        path: '/write',
        element: <Suspense fallback={Loading}><Write/></Suspense>
    },
    {
        path: '/signup',
        children: signupRouter()
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