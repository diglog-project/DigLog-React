import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className='flex justify-center items-center py-8 bg-gray-100'>
            <Link
                to={'https://github.com/orgs/diglog-project/repositories'}
                target={'_blank'}
                className='text-gray-400'
            >
                <FaGithub className='size-6' />
            </Link>
        </div>
    );
}

export default Footer;
