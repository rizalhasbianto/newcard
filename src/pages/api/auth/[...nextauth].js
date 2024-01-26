import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "src/lib/mongodb";

const bcrypt = require('bcrypt');

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error(
        "please provide process.env.NEXTAUTH_SECRET environment variable"
    );
}

console.log("session api call ")

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                const { email, password } = credentials;
                const client = await clientPromise;
                const db = client.db(process.env.DB_NAME);
                const userTable = process.env.MONGODB_COLLECTION_USER
                const response = await db.collection(userTable).find({ email: email }).limit(1).toArray();

                if (response.length === 0) {
                    throw new Error("User with that email is not found");
                }
                if (response[0].status !== "active") {
                    throw new Error("User was not active");
                }

                const matchPass = await bcrypt.compare(password, response[0]?.password);

                if (matchPass) {
                    return {
                        name: response[0]?.name,
                        email: response[0]?.email,
                        company: response[0]?.company,
                        role: response[0]?.role,
                        id:response[0]?._id,
                    }
                } else {
                    throw new Error("Invalid password");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    ...user,
                    accessToken: user?.token,
                    refreshToken: user?.refreshToken,
                };
            }
            return token;
        },

        async session({ session, token }) {
            session.user.accessToken = token?.accessToken;
            session.user.detail = {
                name: token?.name,
                email: token?.email,
                company: token?.company,
                role: token?.role,
                id: token?.id
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/login",
    },
};

export default NextAuth(authOptions);
