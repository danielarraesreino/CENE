import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Django API",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.access) {
            // Fetch user profile to get the role
            const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
              headers: { "Authorization": `Bearer ${data.access}` },
            });
            const profile = await profileRes.json();

            return {
              id: credentials.username,
              name: profile.first_name || credentials.username,
              email: profile.email,
              role: profile.role,
              accessToken: data.access,
              refreshToken: data.refresh,
            };
          }
          return null;
        } catch (e) {
          console.error("Auth error:", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
