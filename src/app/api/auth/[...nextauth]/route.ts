import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Usuario from '@/models/Usuario';

// Necesitaremos estas variables de entorno en producción
// Para desarrollo, usaremos valores fijos
const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Se requiere email y contraseña');
        }

        await dbConnect();

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email: credentials.email }).select('+password');

        if (!usuario) {
          throw new Error('Email o contraseña incorrectos');
        }

        // Verificar contraseña
        const coincidePassword = await bcrypt.compare(credentials.password, usuario.password);

        if (!coincidePassword) {
          throw new Error('Email o contraseña incorrectos');
        }

        // Si todo está bien, retornar datos del usuario (sin la contraseña)
        return {
          id: usuario._id.toString(),
          name: usuario.nombre,
          email: usuario.email,
          role: usuario.rol
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  session: {
    strategy: 'jwt',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
