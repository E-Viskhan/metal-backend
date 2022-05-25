import jwt from "jsonwebtoken";
import {UserTokenData} from "../types";
import {db} from "../db";

const TokenService = {
    generateTokens: user => {
        const payload = {
            id: user.id,
            email: user.email
        };

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        }
    },
    async saveToken(userId: number, refreshToken: string) {
        return await db.token.upsert({
            where: {
                userId
            },
            update: {
                refreshToken
            },
            create: {
                userId,
                refreshToken
            }
        });
    },
    validateAccessToken: accessToken => {
        try {
            return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as UserTokenData;
        } catch (e) {
            return null;
        }
    },
    validateRefreshToken: refreshToken => {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as UserTokenData
        } catch {
            return null;
        }
    }
}

export default TokenService;