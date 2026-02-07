import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/", // Custom sign-in page (Landing Page)
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // On initial sign in, add user info to token
            if (account && user) {
                token.email = user.email
                token.name = user.name
                token.picture = user.image
            }
            return token
        },
        async session({ session, token }) {
            // Create a custom JWT signed with our secret that the API can verify
            const secret = process.env.NEXTAUTH_SECRET
            if (secret && token.email) {
                const accessToken = jwt.sign(
                    {
                        email: token.email,
                        name: token.name,
                        picture: token.picture
                    },
                    secret,
                    { expiresIn: '1d' }
                )
                // @ts-ignore
                session.accessToken = accessToken
            }
            return session
        },
    },
}

