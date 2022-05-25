import {ApolloError} from "apollo-server-express";
import {Context} from "../../../types";
import bcrypt from 'bcrypt';
import {getMillisecondsFromDay} from "../../../utils";
import TokenService from "../../../services/TokenService";
import authMiddleware from "../../../authMiddleware";

export const user = {
    registration: async (
        parent,
        args: { email: string, password: string, firstname: string, lastname?: string },
        ctx: Context
    ) => {
        const {email, password, firstname, lastname} = args;
        const isUserAlreadyExists = await ctx.prisma.user.findUnique({where: {email}});

        if (isUserAlreadyExists) {
            return new ApolloError(
                `Пользователь с почтовым адресом ${email} уже существует!`,
                'USER_ALREADY_EXISTS'
            );
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await ctx.prisma.user.create({
            data: {email, password: hashPassword, firstname, lastname}
        });

        const {refreshToken, accessToken} = TokenService.generateTokens(user);

        await ctx.prisma.token.upsert({
            where: {
                userId: user.id
            },
            update: {
                refreshToken
            },
            create: {
                userId: user.id,
                refreshToken
            }
        });

        ctx.res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: getMillisecondsFromDay(30)})

        return accessToken;
    },
    login: async (parent, args: { email: string, password: string }, ctx: Context) => {
        const {email, password} = args;
        const user = await ctx.prisma.user.findUnique({where: {email}});

        if (!user) {
            throw new ApolloError(
                'User not found',
                'NON_EXISTENT_USER'
            );
        }
        const isPassEquals = await bcrypt.compare(password, user.password);

        if (!isPassEquals) {
            throw new ApolloError('Incorrect password', 'INCORRECT PASSWORD')
        }

        const {refreshToken, accessToken} = TokenService.generateTokens(user);

        await ctx.prisma.token.upsert({
            where: {
                userId: user.id
            },
            update: {
                refreshToken
            },
            create: {
                userId: user.id,
                refreshToken
            }
        });

        ctx.res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: getMillisecondsFromDay(30)});

        return accessToken;
    },
    logout: authMiddleware(async (parent, args, ctx: Context) => {
        const userId = ctx.user.id;
        await ctx.prisma.token.delete({where: { userId }});
        ctx.res.clearCookie('refreshToken');

        return 'You are logged out';
    }),
    refresh: async (parent, args, ctx: Context) => {
        const { refreshToken } = ctx.req.cookies;

        if (!refreshToken) {
            return new ApolloError('You did not pass refresh token in cookies', 'REQUEST_NOT_CONTAIN_REFRESH_TOKEN')
        }

        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await ctx.prisma.token.findUnique({ where: { refreshToken }})

        if (!userData || !tokenFromDB) {
            return new ApolloError('Incorrect refresh token', 'INCORRECT_REFRESH_TOKEN')
        }

        const user = await ctx.prisma.user.findUnique({ where: { id: userData.id }})
        const tokens = TokenService.generateTokens(user);

        await ctx.prisma.token.upsert({
            where: {
                userId: user.id
            },
            update: {
                refreshToken: tokens.refreshToken
            },
            create: {
                userId: user.id,
                refreshToken: tokens.refreshToken
            }
        });

        ctx.res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, maxAge: getMillisecondsFromDay(30)});

        return tokens.accessToken;
    }
};