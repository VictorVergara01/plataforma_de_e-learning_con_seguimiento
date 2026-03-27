import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    accessToken?: string
    id?: string
  }
  interface Session {
    user: User & {
      role?: string
      accessToken?: string
      id?: string
    }
  }
}
