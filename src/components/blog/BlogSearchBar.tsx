function BlogSearchBar({value, setValue}: {
    value: string,
    setValue: (value: string) => void,
}) {
    return (
        <input
            className="border border-gray-400 p-2 text-sm"
            type="text"
            value={value}
            onChange={(e) => {
                setValue(e.target.value)
            }}>
        </input>
    );
}

export default BlogSearchBar;