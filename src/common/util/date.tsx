export const fullDateToKorean = (date: Date) => {
    const outputDate = new Date(date);
    return outputDate.getFullYear() + '년 '
        + (outputDate.getMonth() + 1) + '월 '
        + outputDate.getDate() + '일 '
        + outputDate.getHours().toString().padStart(2, '0') + ':'
        + outputDate.getMinutes().toString().padStart(2, '0');
}

export const dateToKorean = (date: Date) => {
    const outputDate = new Date(date);
    return outputDate.getFullYear() + '년 '
        + (outputDate.getMonth() + 1) + '월 '
        + outputDate.getDate() + '일';
}

export const relativeDateToKorean = (date: Date) => {
    const outputDate = new Date(date);
    const now = new Date();

    const diffHours = now.getHours() - outputDate.getHours();

    if (diffHours < 0) {
        return dateToKorean(date);
    } else if (diffHours < 1) {
        return `방금 전`;
    } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
    } else if (diffHours < 24 * 7) {
        return `${diffHours / 24}일 전`;
    } else {
        return dateToKorean(date);
    }
}

export const shortDateToKorean = (date: Date) => {
    const outputDate = new Date(date);
    return (outputDate.getMonth() + 1) + '월 '
        + outputDate.getDate() + '일 ';
}

export const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};