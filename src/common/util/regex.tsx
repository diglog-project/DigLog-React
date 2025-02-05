export const checkEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email !== "" || email.match(regex);
}

export const checkPassword = (password: string) => {
    const regex = "^(?=.*[A-Za-z])(?=.*\\\\d)[A-Za-z\\\\d]{8,16}$";
    return password !== "" || password.match(regex);
}