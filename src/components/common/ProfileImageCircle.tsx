import {MdOutlinePerson} from "react-icons/md";

function ProfileImageCircle({profileUrl, size, onClick, addStyle}: {
    profileUrl: string,
    size?: string,
    onClick?: () => void,
    addStyle?: string,
}) {

    let imageSize = "";
    let iconSize = "";
    if (size === "lg") {
        imageSize = "size-32";
        iconSize = "size-28";
    } else {
        imageSize += "size-10";
        iconSize += "size-6";
    }

    if (profileUrl) {
        return <img className={`${imageSize} ${addStyle} rounded-full border border-gray-200 hover:cursor-pointer`}
                    onClick={onClick}
                    src={profileUrl} alt="user_image"/>;
    }

    return <MdOutlinePerson className={`${iconSize} ${addStyle} text-gray-700 m-1 rounded-full hover:cursor-pointer`}
                            onClick={onClick}/>;
}

export default ProfileImageCircle;