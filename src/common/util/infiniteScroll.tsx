import { useEffect, useState, useMemo, useRef, MutableRefObject } from 'react';
import { PostResponse } from "../types/post.tsx";

export interface InfiniteScrollProps {
    root?: Element | null;
    rootMargin?: string;
    target: MutableRefObject<HTMLDivElement | null>;
    threshold?: number;
    targetArray: Array<PostResponse>;
    endPoint?: number;
}

const useInfiniteScroll = ({
    root = null,
    target,
    threshold = 1,
    rootMargin = '0px',
    targetArray,
    endPoint = 1
}: InfiniteScrollProps) => {

    const [page, setPage] = useState<number>(0);
    const currentChild = useRef<Element | null>(null);

    // IntersectionObserver 생성자 등록 및 callback 함수 등록
    const observer = useMemo(() => {
        return new IntersectionObserver(
            (entries, observer) => {
                if (target?.current === null) {
                    return;
                }
                if (entries[0].isIntersecting) {
                    setPage((v) => v + 1);
                    // setPage 가 무한으로 올라가는 것을 방지하기 위한 연결 끊음
                    observer.disconnect();
                }
            },
            {
                root,
                rootMargin,
                threshold,
            },
        );
    }, [target, root, rootMargin, threshold]);

    useEffect(() => {
        if (target?.current === null) {
            return;
        }

        // 관측하는 Element 가 달라졌을 때, 다시 관측을 시작
        const observeChild = target.current.children[target.current.children.length - endPoint];
        if (observeChild && currentChild.current !== observeChild) {
            currentChild.current = observeChild;
            observer.observe(observeChild);
        }

        return () => {
            if (target.current !== null && observer) {
                observer.unobserve(target.current);
            }
        };
    }, [page, targetArray, target, endPoint, observer]);

    return {
        page,
        setPage
    };
};

export default useInfiniteScroll;