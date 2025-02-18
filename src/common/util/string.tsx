export const getFolderTitle = (title: string, depth: number) => {
    let prefix = "";
    if (depth === 1) {
        prefix = "↳";
    } else if (depth === 2) {
        prefix = "-";
    }
    return `${prefix} ${title}`;
}