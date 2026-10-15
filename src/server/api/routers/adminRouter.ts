import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "@/lib/auth";
import {
  groupSchema,
  selectedGroupSchema,
  studentIdSchema,
  updateStudentSchema,
} from "../../schema/AdminSchema";

const enforceAdmin = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  }
  return next();
});

export const adminRouter = createTRPCRouter({
  listUsers: enforceAdmin.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
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

  getDefaultGroup: enforceAdmin.query(async ({ ctx }) => {
    const setting = await ctx.prisma.setting.findUnique({
      where: { key: "defaultGroup" },
    });
    return setting?.value || "norwaySpring2026";
  }),

  updateStudent: enforceAdmin
    .input(updateStudentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.update({
          where: { id: input.userId },
          data: { group: input.group, protusId: input.protusId },
          select: { id: true },
        });
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This Student ID is already linked to another account.",
          });
        }
        throw error;
      }
    }),

  setGroupForSelected: enforceAdmin
    .input(selectedGroupSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        const result = await tx.user.updateMany({
          where: {
            OR: input.students.map((student) => ({
              id: student.id,
              group: student.previousGroup,
            })),
          },
          data: { group: input.group },
        });
        // Roll back the whole selection if another administrator changed a group.
        if (result.count !== input.students.length) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Some accounts changed since your review. Refresh the list and try again. No changes were saved.",
          });
        }
        return { count: result.count };
      });
    }),

  setUserProtusId: enforceAdmin
    .input(z.object({ userId: z.string(), protusId: studentIdSchema }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.userId },
        data: { protusId: input.protusId },
        select: { id: true },
      });
    }),

  setUserGroup: enforceAdmin
    .input(z.object({ userId: z.string(), group: groupSchema }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.userId },
        data: { group: input.group },
        select: { id: true },
      });
    }),

  setGroupForAll: enforceAdmin
    .input(z.object({ group: groupSchema }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.updateMany({ data: { group: input.group } });
      return { success: true };
    }),

  setDefaultGroup: enforceAdmin
    .input(z.object({ group: groupSchema }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.setting.upsert({
        where: { key: "defaultGroup" },
        update: { value: input.group },
        create: { key: "defaultGroup", value: input.group },
      });
      return { success: true };
    }),

  resetPassword: enforceAdmin
    .input(z.object({ userId: z.string(), newPassword: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const hashed = await hashPassword(input.newPassword);
      await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { password: hashed },
      });
      return { success: true };
    }),
});
