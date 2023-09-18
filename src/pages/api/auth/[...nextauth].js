import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "src/lib/mongodb";

const bcrypt = require('bcrypt');

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error(
        "please provide process.env.NEXTAUTH_SECRET environment variable"
    );
}

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            async authorize(credentials, req) {
                const { email, password } = credentials;
                // perform you login logic
                // find out user from db
                const client = await clientPromise;
                const db = client.db(process.env.DB_NAME);
                const response = await db.collection("user").find({ email: email }).limit(10).toArray();

                if (response.length === 0) {
                    console.log("there is no user with that username");
                    throw new Error("User with that email is not found");
                }

                const matchPass = await bcrypt.compare(password, response[0].password);

                if (matchPass) {
                    return {
                        name:response[0].name,
                        email:response[0].email,
                        company:response[0].company,
                        role:response[0].role
                    }
                } else {
                    console.log("invalid password");
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
                    accessToken: user.token,
                    refreshToken: user.refreshToken,
                };
            }
            return token;
        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.detail = {
                name:token.name,
                email:token.email,
                company:token.company,
                role:token.role
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/login",
    },
};

export default NextAuth(authOptions);
