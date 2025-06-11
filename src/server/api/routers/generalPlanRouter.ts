import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";

export const generalPlanRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return prisma.generalPlan.findFirst({
      where: { userId: ctx.user.id },
    });
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), gradeGoal: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Só cria se não existir
      const existing = await prisma.generalPlan.findFirst({
        where: { userId: ctx.user.id },
      });
      if (existing) return existing;
      return prisma.generalPlan.create({
        data: {
          userId: ctx.user.id,
          name: input.name,
          gradeGoal: input.gradeGoal,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        gradeGoal: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.generalPlan.updateMany({
        where: { userId: ctx.user.id },
        data: input,
      });
    }),
});
