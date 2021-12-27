import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { Login_URL } from "../../../lib/spotify";

async function refreshAccessTokenCustom(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("Refreshed access token", refreshedToken);
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
      // 1 hour as 3600 ms returned from spotify api
      // returning new refresh token if it exits in response else returning old refresh token
      refreshToken: refreshedToken.refreshToken ?? token.refresh_token,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: Login_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial signin
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpiresAt: account.expires_at * 1000,
        };
      }

      // Returns the previous token if the access token has not expired
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IN VALID");
        return token;
      }

      //ACCESS TOKEN HAS EXPIRED, SO WE NEED TO REFRESH IT
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING");
      return await refreshAccessTokenCustom(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      return session;
    },
  },
});
