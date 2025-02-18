import {TagResponse} from "../../common/types/post.tsx";
import {TextButton} from "../common/TextButton.tsx";

function BlogTagCard({tag, addTag}: {
    tag: TagResponse,
    addTag: (tagName: string) => void,
}) {
    return (
        <TextButton
            text={tag.name}
            onClick={() => addTag(tag.name)}
            addStyle={"!px-1 !py-0 hover:text-lime-700"}/>
    );
}

export default BlogTagCard;