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

    const diffMilliseconds = now.getTime() - outputDate.getTime();

    const hour = 60 * 60 * 1000;
    const day = 24 * hour;
    const week = 7 * day;

    if (diffMilliseconds < 0) {
        return dateToKorean(date);
    } else if (diffMilliseconds < hour) {
        return `방금 전`;
    } else if (diffMilliseconds < day) {
        return `${Math.round(diffMilliseconds / hour)}시간 전`;
    } else if (diffMilliseconds < week) {
        return `${Math.round(diffMilliseconds / day)}일 전`;
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