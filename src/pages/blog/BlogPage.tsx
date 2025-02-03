import BasicLayout from "../../layout/BasicLayout.tsx";
import {useParams} from "react-router-dom";

function BlogPage() {

    const {username} = useParams();
    console.log(username);

    return (
        <BasicLayout>
            <div>{username}</div>
        </BasicLayout>
    );
}

export default BlogPage;