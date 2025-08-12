import { TagResponse } from '../../common/types/post.tsx';
import { TextButton } from '../common/TextButton.tsx';
import { useNavigate } from 'react-router-dom';

function BlogTagCard({ tag, username }: { tag: TagResponse; username: string }) {
    const navigate = useNavigate();

    return (
        <TextButton
            text={tag.name}
            onClick={() => navigate(`/blog/${username}/tag`, { state: { tagId: tag.id } })}
            addStyle={'!px-1 !py-0 hover:text-lime-700'}
        />
    );
}

export default BlogTagCard;
