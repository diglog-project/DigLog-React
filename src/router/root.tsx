import {createBrowserRouter} from "react-router-dom";
import {Suspense} from "react";
import {Loading, Main} from "./page.tsx";

const root = createBrowserRouter([
    {
        path: '',
        element: <Suspense fallback={Loading}><Main /></Suspense>
    },
]);

export default root;