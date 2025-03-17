interface TabType {
    section: string;
    title: string;
}

function SettingSideBar({setSelectedSection, side}: {
    setSelectedSection: (section: string) => void,
    side: boolean,
}) {

    const tabList: TabType[] = [
        {section: "profile", title: "프로필"},
        {section: "folder", title: "폴더"},
        {section: "post", title: "게시글"},
    ];

    const handleSelectedTab = (tabSection: string) => {
        const tab = tabList.find(tab => tab.section === tabSection);
        if (tab) {
            setSelectedSection(tab.section);
        }
    }

    return (
        <div
            className={`w-48 h-full flex-col justify-start items-start ${side && "pt-16 px-4 bg-gray-50 h-screen"}`}>
            <ul className="w-full flex flex-col gap-y-1.5 flex-wrap">
                {tabList.map((tab) =>
                    <li key={tab.section}>
                        <button
                            onClick={() => handleSelectedTab(tab.section)}
                            className="text-left w-full p-2 my-1 hover:bg-gray-200 hover:cursor-pointer">
                            {tab.title}
                        </button>
                    </li>)}
            </ul>
        </div>
    );
}

export default SettingSideBar;