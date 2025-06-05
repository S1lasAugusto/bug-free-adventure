import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reflectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        subPlanId: z.string(),
        type: z.string(),
        control: z.number().optional(),
        awareness: z.number().optional(),
        strengths: z.number().optional(),
        planning: z.number().optional(),
        alternatives: z.number().optional(),
        summary: z.number().optional(),
        diagrams: z.number().optional(),
        adaptation: z.number().optional(),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.reflection.create({
        data: {
          subPlanId: input.subPlanId,
          type: input.type,
          control: input.control ?? 0,
          awareness: input.awareness ?? 0,
          strengths: input.strengths ?? 0,
          planning: input.planning ?? 0,
          alternatives: input.alternatives ?? 0,
          summary: input.summary ?? 0,
          diagrams: input.diagrams ?? 0,
          adaptation: input.adaptation ?? 0,
          comment: input.comment,
        },
      });
    }),

  getBySubPlan: protectedProcedure
    .input(z.object({ subPlanId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.reflection.findMany({
        where: {
          subPlanId: input.subPlanId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string().optional(),
        control: z.number().optional(),
        awareness: z.number().optional(),
        strengths: z.number().optional(),
        planning: z.number().optional(),
        alternatives: z.number().optional(),
        summary: z.number().optional(),
        diagrams: z.number().optional(),
        adaptation: z.number().optional(),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.reflection.update({
        where: { id },
        data,
      });
    }),
});
