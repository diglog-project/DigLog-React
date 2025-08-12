import { Code, Email, Loading, Platform, Signup } from './page.tsx';
import { Suspense } from 'react';

const signupRouter = () => {
    return [
        {
            path: 'platform',
            element: (
                <Suspense fallback={Loading}>
                    <Platform />
                </Suspense>
            ),
        },
        {
            path: 'email',
            element: (
                <Suspense fallback={Loading}>
                    <Email />
                </Suspense>
            ),
        },
        {
            path: 'code',
            element: (
                <Suspense fallback={Loading}>
                    <Code />
                </Suspense>
            ),
        },
        {
            path: '',
            element: (
                <Suspense fallback={Loading}>
                    <Signup />
                </Suspense>
            ),
        },
    ];
};

export default signupRouter;
