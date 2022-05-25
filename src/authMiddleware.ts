import {AuthenticationError} from 'apollo-server-express';
import {Context} from "./types";
import TokenService from "./services/TokenService";

const authMiddleware = (next) => (parent, args, ctx: Context) => {
    const authorizationHeader = ctx.req.headers.authorization;

    if (!authorizationHeader) {
        throw new AuthenticationError("Your request does not contain an authorization header!");
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
        throw new AuthenticationError('The format of your authentication header should be "Bearer $accessToken"');
    }

    const userData = TokenService.validateAccessToken(accessToken);

    if (!userData) {
        throw new AuthenticationError('Invalid access token. Please refresh your tokens.');
    }

    ctx.user = {id: userData.id, email: userData.email};

    return next(parent, args, ctx);
};

export default authMiddleware;