import jwt from 'jsonwebtoken';

export const generateTokens = user => {
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

export const getMillisecondsFromDay = days => days * 24 * 60 * 60 * 1000;