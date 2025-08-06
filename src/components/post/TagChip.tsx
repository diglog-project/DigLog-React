import { MdOutlineClear } from "react-icons/md";

function TagChip({ name, removeTag }: { name: string, removeTag: (selectTag: string) => void }) {
    return (
        <button
            className="flex justify-between items-center rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm hover:brightness-120 hover:cursor-pointer"
            onClick={() => removeTag(name)}>
            {name}
            <MdOutlineClear className="ml-2" />
        </button>
    );
}

export default TagChip;