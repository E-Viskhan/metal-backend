import {ApolloError} from "apollo-server";
import {Context} from "../../../context";
import bcrypt from 'bcrypt';
import {generateTokens, getMillisecondsFromDay} from "../../../utils";

export const user = {
    createUser: async (
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

        const {refreshToken, accessToken} = generateTokens(user);

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

        ctx.res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: getMillisecondsFromDay(30) })

        return accessToken;
    }
};