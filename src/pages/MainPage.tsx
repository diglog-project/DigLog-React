import BasicLayout from "../layout/BasicLayout.tsx";
import {useEffect} from "react";
import {getProfile} from "../apis/member.tsx";
import {login} from "../slices/loginSlice.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store.tsx";

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
            <div className="">
                MainPage
            </div>
        </BasicLayout>
    );
}

export default MainPage;