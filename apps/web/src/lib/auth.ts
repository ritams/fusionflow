import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

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
        async jwt({ token, account }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {
                token.id_token = account.id_token
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (session.user) {
                // @ts-ignore
                session.id_token = token.id_token
            }
            return session
        },
    },
}
