import {Email, Loading, SignUp} from "./page.tsx";
import {Suspense} from "react";

const signupRouter = () => {

    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><SignUp/></Suspense>
        },
        {
            path: 'email',
            element: <Suspense fallback={Loading}><Email/></Suspense>
        },
    ];
}

export default signupRouter;