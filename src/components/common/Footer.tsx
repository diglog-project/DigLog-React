import {FaGithub} from "react-icons/fa";
import {Link} from "react-router-dom";

function Footer() {
    return (
        <div className="my-16 py-8 bg-gray-100">
            <Link to={"https://github.com/orgs/diglog-project/repositories"} target={"_blank"}
                  className="flex justify-center items-center gap-x-4 text-gray-400">
                <FaGithub className="size-6"/>
                <div className="">Github Repository</div>
            </Link>
        </div>
    );
}

export default Footer;