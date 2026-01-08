import NextAuth from "next-auth"
import {db} from "@/lib/db/client"
import {logger} from "@/lib/logger"
import authConfig from "./config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks:{
     async signIn({user, account}){
        if(!user?.email || !account) {
          logger.warn("SignIn attempt without required fields");
          return false;
        }
        
        try {
          // Check if user exists
          const existingUser = await db.user.findUnique({
            where: { email: user.email }
          });

          if(!existingUser){
            // Create new user with account
            logger.info(`Creating new user: ${user.email}`);
            await db.user.create({
              data: {
                name: user.name || "",
                email: user.email,
                image: user.image || "",
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope,
                    refresh_token: account.refresh_token,
                    expires_at: account.expires_at,
                    id_token: account.id_token,
                    session_state: typeof account.session_state === 'string' ? account.session_state : null,
                  }
                }
              }
            });
          } else {
            // User exists, check if account exists
            const existingAccount = await db.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId
              }
            });
            
            if(!existingAccount){
              // Add new account to existing user
              logger.info(`Linking new account for user: ${user.email}`);
              await db.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  id_token: account.id_token,
                  session_state: typeof account.session_state === 'string' ? account.session_state : null,
                }
              });
            }
          }
          return true;
        } catch (error) {
          logger.error("SignIn callback error:", error as Error);
          logger.warn("Database unavailable during sign-in; allowing provider authentication without persisting account.");
          // Allow authentication to proceed even if DB is temporarily unreachable
          return true;
        }
     },
     
     async jwt({token, user}){
        if(user) {
          token.sub = user.id;
        }
        
        if(!token.sub) return token;
        
        try {
          const existingUser = await db.user.findUnique({
            where: { id: token.sub }
          });
          if(!existingUser) return token;

          token.name = existingUser.name;
          token.email = existingUser.email;
          token.role = existingUser.role;
        } catch (error) {
          // If the database is unavailable, avoid noisy stack traces and return cached token info.
          const msg = (error as any)?.message || String(error);
          const isDbConnectErr = msg.includes('Error creating a database connection') || msg.includes('PrismaClientInitializationError') || msg.includes('DNS resolution') || msg.includes('os error 10013');
          if (isDbConnectErr) {
            logger.warn(
              'JWT callback: database connection failed (Prisma). Returning cached token. Check MongoDB network access, Atlas IP whitelist, or local firewall.',
              { detail: msg }
            );
          } else {
            logger.error('JWT callback error - continuing with cached token:', error as Error);
          }
        }
        return token;
     },
     
     async session({session, token}){
        if(token.sub && session.user){
            session.user.id = token.sub;
        }
        if(token.role && session.user){
            (session.user as any).role = token.role;
        }
        return session;
     }

  },
  secret: process.env.AUTH_SECRET,
  ...authConfig
});
