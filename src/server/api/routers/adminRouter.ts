import { z } from "zod";
import { createTRPCRouter, protectedProcedure, TRPCError } from "../trpc";
import { prisma } from "@/server/db";
import { hashPassword } from "@/lib/auth";

const enforceAdmin = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  }
  return next();
});

export const adminRouter = createTRPCRouter({
  listUsers: enforceAdmin.query(async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        protusId: true,
        group: true,
        role: true,
        onBoarded: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return users;
  }),

  setUserProtusId: enforceAdmin
    .input(z.object({ userId: z.string(), protusId: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.user.update({
        where: { id: input.userId },
        data: { protusId: input.protusId },
      });
    }),

  setUserGroup: enforceAdmin
    .input(z.object({ userId: z.string(), group: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return prisma.user.update({
        where: { id: input.userId },
        data: { group: input.group },
      });
    }),

  setGroupForAll: enforceAdmin
    .input(z.object({ group: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await prisma.user.updateMany({ data: { group: input.group } });
      return { success: true };
    }),

  setDefaultGroup: enforceAdmin
    .input(z.object({ group: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await prisma.setting.upsert({
        where: { key: "defaultGroup" },
        update: { value: input.group },
        create: { key: "defaultGroup", value: input.group },
      });
      return { success: true };
    }),

  resetPassword: enforceAdmin
    .input(z.object({ userId: z.string(), newPassword: z.string().min(6) }))
    .mutation(async ({ input }) => {
      const hashed = await hashPassword(input.newPassword);
      await prisma.user.update({
        where: { id: input.userId },
        data: { password: hashed },
      });
      return { success: true };
    }),
});
