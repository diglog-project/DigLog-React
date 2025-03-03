import axiosApi from "./AxiosApi.tsx";
import {MemberProfileSearchRequest} from "../types/member.tsx";
import {memberProfileSearchRequestToParameter} from "../util/url.tsx";

export const sendMail = async (email: string) =>
    await axiosApi.post("/verify", {
        email: email
    });

export const checkCode = async (email: string, code: string) =>
    await axiosApi.post("/verify/code", {
        email: email,
        code: code
    });

export const signup = async (email: string, password: string, code: string) =>
    await axiosApi.post("/verify/signup", {
        email: email,
        password: password,
        code: code,
    });

export const loginApi = async (email: string, password: string) =>
    await axiosApi.post("/member/login", {
        email: email,
        password: password
    }, {withCredentials: true});

export const logoutApi = async (email: string) =>
    await axiosApi.post("/member/logout", {
        email: email
    }, {withCredentials: true});

export const handleKakaoLogin = () =>
    location.href = `${import.meta.env.VITE_SERVER_URL}/oauth2/authorization/kakao`;

export const getProfile = async () =>
    await axiosApi.get("/member/profile");

export const getProfileByUsername = async (username: string) =>
    await axiosApi.get(`/member/profile/${username}`);

export const updateUsername = async (username: string) =>
    await axiosApi.post("/member/username", {
        username: username,
    });

export const updateProfileImage = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    return await axiosApi.post("/member/image", formData);
}

export const searchProfile = async (memberProfileSearchRequest: MemberProfileSearchRequest) =>
    await axiosApi.get(`/member/profile/search${memberProfileSearchRequestToParameter(memberProfileSearchRequest)}`);