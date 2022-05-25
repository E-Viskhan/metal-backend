import {Context} from "../../../types";
import {getMillisecondsFromDay} from "../../../utils";
import authMiddleware from "../../../authMiddleware";
import UserService from "../../../services/UserService";

export const user = {
    registration: async (parent, args, ctx: Context) => {
        const {email, password, firstname, lastname} = args;
        const {accessToken, refreshToken} = await UserService.registration(email, password, firstname, lastname);

        ctx.res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: getMillisecondsFromDay(30)});

        return accessToken;
    },
    login: async (parent, args, ctx: Context) => {
        const {email, password} = args;
        const {accessToken, refreshToken} = await UserService.login(email, password);

        ctx.res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: getMillisecondsFromDay(30)});

        return accessToken;
    },
    logout: authMiddleware(async (parent, args, ctx: Context) => {
        const userId = ctx.user.id;
        await UserService.logout(userId);

        ctx.res.clearCookie('refreshToken');

        return 'You are logged out';
    }),
    refresh: async (parent, args, ctx: Context) => {
        const {refreshToken} = ctx.req.cookies;
        const tokens = await UserService.refresh(refreshToken);

        ctx.res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, maxAge: getMillisecondsFromDay(30)});

        return tokens.accessToken;
    }
};