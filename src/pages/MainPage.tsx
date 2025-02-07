import BasicLayout from "../layout/BasicLayout.tsx";
import {useEffect} from "react";
import {getProfile} from "../common/apis/member.tsx";
import {login} from "../common/slices/loginSlice.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store.tsx";
import PostCard from "../components/post/PostCard.tsx";
import {faker} from "@faker-js/faker/locale/ko";

function MainPage() {

    const dispatch = useDispatch();
    const loginState = useSelector((state: RootState) => state.loginSlice);

    useEffect(() => {
        getProfile()
            .then(res => {
                    dispatch(login({
                        ...loginState,
                        email: res.data.email,
                        username: res.data.username,
                    }));
                }
            )
            .catch(err => {
                console.log(err);
            });
    }, []);


    return (
        <BasicLayout>
            <div className="flex flex-col justify-center items-start">
                <div className="text-2xl font-black font-jalnan mb-8">
                    인기 있는 게시글
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {[Array.from({length: 6}).map(() => (
                        <PostCard
                            key={faker.number.int().toString()}
                            id={faker.number.int().toString()}
                            title={faker.lorem.sentence()}
                            content={`${faker.lorem.paragraphs()}<img src=${faker.image.url({width: 320, height: 320})}/>`}
                            username={faker.animal.cat()}
                            tags={[{
                                id: faker.number.int().toString(),
                                name: faker.word.sample()
                            }, {id: faker.number.int().toString(), name: faker.word.sample()}]}
                            createdAt={new Date()}/>
                    ))]}
                    <PostCard
                        key={faker.number.int().toString()}
                        id={faker.number.int().toString()}
                        title={faker.lorem.sentence()}
                        content={`${faker.lorem.paragraphs()}`}
                        username={faker.animal.cat()}
                        tags={[{
                            id: faker.number.int().toString(),
                            name: faker.word.sample()
                        }, {id: faker.number.int().toString(), name: faker.word.sample()}]}
                        createdAt={new Date()}/>
                </div>
            </div>
        </BasicLayout>
    );
}

export default MainPage;