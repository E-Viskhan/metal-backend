import {db} from "../db";
import {ApolloError} from "apollo-server-express";
import bcrypt from "bcrypt";
import TokenService from "./TokenService";

export default {
    registration: async (email: string, password: string, firstname: string, lastname?: string) => {
        const isUserAlreadyExists = await db.user.findUnique({where: {email}});

        if (isUserAlreadyExists) {
            return new ApolloError(
                `Пользователь с почтовым адресом ${email} уже существует!`,
                'USER_ALREADY_EXISTS'
            );
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await db.user.create({
            data: {email, password: hashPassword, firstname, lastname}
        });

        const tokens = TokenService.generateTokens(user);

        await TokenService.saveToken(user.id, tokens.refreshToken);

        return tokens;
    },
    login: async (email: string, password: string) => {
        const user = await db.user.findUnique({where: {email}});

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

        const tokens = TokenService.generateTokens(user);

        await TokenService.saveToken(user.id, tokens.refreshToken)

        return tokens;
    },
    logout: async (userId: number) => {
        await db.token.delete({where: { userId }});
    },
    refresh: async (refreshToken: string) => {
        if (!refreshToken) {
            return new ApolloError('You did not pass refresh token in cookies', 'REQUEST_NOT_CONTAIN_REFRESH_TOKEN')
        }

        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await db.token.findUnique({ where: { refreshToken }})

        if (!userData || !tokenFromDB) {
            return new ApolloError('Incorrect refresh token', 'INCORRECT_REFRESH_TOKEN')
        }

        const user = await db.user.findUnique({ where: { id: userData.id }})
        const tokens = TokenService.generateTokens(user);

        await TokenService.saveToken(user.id, refreshToken);

        return tokens;
    }
};