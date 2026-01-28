import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
} from "../../../lib/auth";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      // Verificar se o usuário já existe
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email já está em uso",
        });
      }

      // Hash da senha
      const hashedPassword = await hashPassword(password);

      // Criar usuário
      const user = await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Gerar token
      const token = generateToken(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          onBoarded: user.onBoarded,
          protusId: user.protusId,
          role: user.role,
          group: user.group,
        },
        token,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      // Buscar usuário
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou senha incorretos",
        });
      }

      // Verificar senha
      const isValidPassword = await verifyPassword(password, user.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou senha incorretos",
        });
      }

      // Gerar token
      const token = generateToken(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          onBoarded: user.onBoarded,
          protusId: user.protusId,
          role: user.role,
          group: user.group,
        },
        token,
      };
    }),

  me: publicProcedure.mutation(async ({ ctx }) => {
    // Pegar token do header
    const authHeader = ctx.req?.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : ctx.req?.headers.cookie
          ?.split(";")
          .find((c: string) => c.trim().startsWith("auth-token="))
          ?.split("=")[1];

    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Token não fornecido",
      });
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Token inválido",
      });
    }

    // Buscar usuário
    const user = await ctx.prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não encontrado",
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      onBoarded: user.onBoarded,
      protusId: user.protusId,
      role: user.role,
      group: user.group,
    };
  }),
});
