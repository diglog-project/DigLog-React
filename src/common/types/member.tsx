export interface MemberProfileSearchRequest {
    username: string,
    page: number,
    size: number,
}

export interface MemberProfileResponse {
    username: string,
    profileUrl: string | null,
}