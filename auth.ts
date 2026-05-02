import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.username === process.env.ADMIN_USER &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: '1', name: 'Admin' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
}