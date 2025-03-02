import {MdOutlinePerson} from "react-icons/md";

function ProfileImageCircle({profileUrl, size, onClick, addStyle}: {
    profileUrl: string,
    size?: string,
    onClick?: () => void,
    addStyle?: string,
}) {

    let imageSize = "size-";
    let iconSize = "size-";
    if (size === "lg") {
        imageSize += "32";
        iconSize += "28";
    } else {
        imageSize += "10";
        iconSize += "6";
    }

    if (profileUrl) {
        return <img className={`${imageSize} ${addStyle} rounded-full border border-gray-200 hover:cursor-pointer`}
                    onClick={onClick}
                    src={profileUrl} alt="user_image"/>;
    }

    return <MdOutlinePerson className={`${iconSize} ${addStyle} mx-auto text-gray-700 m-1 rounded-full hover:cursor-pointer`}
                            onClick={onClick}/>;
}

export default ProfileImageCircle;