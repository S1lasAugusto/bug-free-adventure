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
      // Busca o plano geral do usuário primeiro
      const existingPlan = await prisma.generalPlan.findFirst({
        where: { userId: ctx.user.id },
      });

      if (!existingPlan) {
        throw new Error("General plan not found for this user");
      }

      return prisma.generalPlan.update({
        where: { id: existingPlan.id },
        data: input,
      });
    }),
});
