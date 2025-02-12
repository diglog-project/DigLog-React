export const removeImgTags = (content: string) => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const imgTags = doc.querySelectorAll('img');
    imgTags.forEach((img) => img.remove());
    return doc.body.innerHTML;
}

export const getImgSrc = (content: string) => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const imgTag = doc.querySelector('img');
    return imgTag ? imgTag.src : null;
}

export const getImgUrls = (content: string) => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const images = doc.querySelectorAll('img');
    return Array.from(images).map(img => img.src);
}