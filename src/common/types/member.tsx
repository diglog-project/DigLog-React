export interface MemberProfileSearchRequest {
    username: string,
    page: number,
    size: number,
}

export interface MemberProfileSearchResponse {
    username: string,
    profileUrl: string | null,
}