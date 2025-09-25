import { Suspense } from 'react';
import { Loading, Post, Write } from './page.tsx';

const postRouter = () => {
    return [
        {
            path: 'edit/:id',
            element: (
                <Suspense fallback={Loading}>
                    <Write />
                </Suspense>
            ),
        },
        {
            path: ':id',
            element: (
                <Suspense fallback={Loading}>
                    <Post />
                </Suspense>
            ),
        },
    ];
};

export default postRouter;
