import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { AccessTokenPayload, RefreshTokenPayload } from './type/jwtPayload';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService) { }

    createAccessToken({ userId }: AccessTokenPayload): string {
        return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d',
        });
    }

    createRegisterToken({ userId }: AccessTokenPayload): string {
        return sign({ userId }, process.env.REGISTER_TOKEN_SECRET);
    }

    createRefreshToken({ userId, tokenVersion }: RefreshTokenPayload): string {
        return sign({ userId, tokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        });
    }

    assignTokens(userId: number, tokenVersion: number) {
        return {
            accessToken: this.createAccessToken({ userId }),
            refreshToken: this.createRefreshToken({ userId, tokenVersion }),
        };
    }

    async generateRandomString(length: number): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    /** If refresh token is not expired, re-assign new access token and refresh token */
    async refreshTokens(refreshToken: string) {
        // let decodedRefreshToken: RefreshTokenPayload;
        // let user: UserResponse;

        const decodedRefreshToken = verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        const user = await this.userService.findOneById(decodedRefreshToken.userId);

        // If user is not found or the refresh token version doesn't match, throw error
        if (!user || user.tokenVersion !== decodedRefreshToken.tokenVersion) {
            throw new Error('Please register or sign in.');
        }

        const { id, tokenVersion } = user;

        const tokens = await this.assignTokens(id, tokenVersion);
        return {
            user,
            ...tokens,
        };
    }

}