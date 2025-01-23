import {createBrowserRouter} from "react-router-dom";
import {Suspense} from "react";
import {Loading, Login, Main} from "./page.tsx";

const root = createBrowserRouter([
    {
        path: '',
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: '/login',
        element: <Suspense fallback={Loading}><Login/></Suspense>
    },
]);

export default root;