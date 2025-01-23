import {lazy} from "react";

export const Loading =
    <div className="flex items-center justify-center w-screen h-screen">
        Loading...
    </div>;

export const Main = lazy(() => import('../pages/MainPage'));