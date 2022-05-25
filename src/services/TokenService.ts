import jwt from "jsonwebtoken";
import {UserTokenData} from "../types";

class TokenService {
    generateTokens = user => {
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
    }

    validateAccessToken = accessToken => {
        try {
            return jwt.verify(accessToken,  process.env.JWT_ACCESS_SECRET) as UserTokenData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken = refreshToken => {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as UserTokenData
        } catch {
            return null;
        }
    }
}

export default new TokenService();