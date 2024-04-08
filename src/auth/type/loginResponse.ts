export interface LoginResponse {
    accessToken: string;
    code: string;
    isNew: boolean;
    refreshToken?: string;
}