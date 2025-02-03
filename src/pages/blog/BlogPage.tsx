import BasicLayout from "../../layout/BasicLayout.tsx";
import {useParams} from "react-router-dom";
import {faker} from "@faker-js/faker/locale/ko";
import PostCard from "../../components/post/PostCard.tsx";
import TagCard from "../../components/post/TagCard.tsx";
import {useEffect, useRef, useState} from "react";
import {MdMenu, MdOutlineExitToApp} from "react-icons/md";

function BlogPage() {

    const {username} = useParams();

    const sideBarRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuOpen = () => {
        setIsOpen(cur => !cur);
    }
    const handleClickOutside = (event: MouseEvent) => {
        if (sideBarRef.current && !sideBarRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        document.title = username || "DIGLOG";
    }, []);

    return (
        <BasicLayout>
            <div className=" flex justify-between items-center text-2xl font-black px-4 py-8">
                <div>{username}의 블로그</div>
                <button onClick={handleMenuOpen} className="md:hidden hover:cursor-pointer">
                    <MdMenu className="size-8"/>
                </button>
            </div>
            <div className="md:grid md:grid-cols-3">
                <div className="col-span-2 flex flex-col gap-y-4 p-4 mx-auto md:border-r border-r-gray-200">
                    {[Array.from({length: 3}).map(() => (
                        <PostCard
                            key={faker.number.int().toString()}
                            id={faker.number.int().toString()}
                            title={faker.lorem.sentence()}
                            content={`${faker.lorem.paragraphs()}<img src=${faker.image.url({
                                width: 320,
                                height: 320
                            })}/>`}
                            username={faker.animal.cat()}
                            tags={[{
                                id: faker.number.int().toString(),
                                name: faker.word.sample()
                            }, {id: faker.number.int().toString(), name: faker.word.sample()}]}
                            createdAt={new Date()}/>
                    ))]}
                    <div className="flex justify-center items-center gap-x-4">
                        {[Array.from({length: 3}).map((_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))]}
                    </div>
                </div>
                <div className="hidden md:block col-span-1 flex-col">
                    <SideBar username={username}/>
                </div>
                <div ref={sideBarRef}
                     className={`${isOpen ? "translate-x-0" : "translate-x-full"} absolute top-0 right-0 w-96 h-max bg-gray-50 flex-col
                     transform transition-transform duration-300 ease-out`}>
                    <button className="absolute top-4 right-[calc(336px)] hover:cursor-pointer"
                            onClick={() => setIsOpen(false)}>
                        <MdOutlineExitToApp className="size-8 text-gray-500"/>
                    </button>
                    <SideBar username={username}/>
                </div>
            </div>
        </BasicLayout>
    );
}

function SideBar({username}: { username: string | undefined }) {

    return (
        <>
            <div className="flex flex-col justify-start items-center py-4 gap-4">
                <img className="border border-gray-300 h-32 w-32 rounded-full"
                     src={faker.image.avatar()} alt={username}/>
                <div className="flex justify-center items-center text-2xl font-black">
                    {username}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 py-8">
                <div className="font-bold text-center">폴더</div>
                <div className="flex flex-col gap-y-4 p-2">
                    {[Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="flex flex-col gap-y-2 font-semibold">
                            <button className="flex justify-start items-center hover:cursor-pointer">
                                {faker.word.words()}
                            </button>
                            <div
                                className="flex flex-col gap-y-1 font-normal text-gray-400 border-l border-gray-300 pl-2">
                                <button className="flex justify-start hover:cursor-pointer">
                                    {faker.word.words()}
                                </button>
                                <button className="flex justify-start hover:cursor-pointer">
                                    {faker.word.words()}
                                </button>
                                <button className="flex justify-start hover:cursor-pointer">
                                    {faker.word.words()}
                                </button>
                            </div>
                        </div>
                    ))]}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 py-8">
                <div className="font-bold text-center">태그</div>
                <div className="flex flex-wrap gap-1.5 p-2">
                    {[Array.from({length: 24}).map(() => (
                        <TagCard key={faker.number.int().toString()}
                                 tag={{
                                     id: faker.number.int().toString(),
                                     name: faker.word.sample()
                                 }}/>
                    ))]}
                </div>
            </div>
        </>
    );
}

export default BlogPage;