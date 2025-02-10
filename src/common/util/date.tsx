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