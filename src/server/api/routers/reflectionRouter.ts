import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const reflectionCreateSchema = z
  .object({
    subPlanId: z.string(),
    type: z.string(),
    control: z.number().min(1).max(5).optional(),
    awareness: z.number().min(1).max(5).optional(),
    strengths: z.number().min(1).max(5).optional(),
    planning: z.number().min(1).max(5).optional(),
    alternatives: z.number().min(1).max(5).optional(),
    summary: z.number().min(1).max(5).optional(),
    diagrams: z.number().min(1).max(5).optional(),
    adaptation: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.type === "edit_reflection") {
      const missing =
        value.control == null ||
        value.awareness == null ||
        value.strengths == null ||
        value.planning == null ||
        !value.comment?.trim();
      if (missing) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Edit reflection requires all scale answers (1-5) and a comment.",
        });
      }
    }

    if (value.type === "complete_reflection") {
      const missing =
        value.alternatives == null ||
        value.summary == null ||
        value.diagrams == null ||
        value.adaptation == null ||
        !value.comment?.trim();
      if (missing) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Complete reflection requires all scale answers (1-5) and a comment.",
        });
      }
    }
  });

const reflectionUpdateSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  control: z.number().min(1).max(5).optional(),
  awareness: z.number().min(1).max(5).optional(),
  strengths: z.number().min(1).max(5).optional(),
  planning: z.number().min(1).max(5).optional(),
  alternatives: z.number().min(1).max(5).optional(),
  summary: z.number().min(1).max(5).optional(),
  diagrams: z.number().min(1).max(5).optional(),
  adaptation: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export const reflectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(reflectionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const subPlan = await ctx.prisma.subPlan.findUnique({
        where: { id: input.subPlanId },
        select: { userId: true },
      });

      if (!subPlan || subPlan.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized access to this sub-plan.",
        });
      }

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
      const subPlan = await ctx.prisma.subPlan.findUnique({
        where: { id: input.subPlanId },
        select: { userId: true },
      });

      if (!subPlan || subPlan.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized access to this sub-plan.",
        });
      }

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
    .input(reflectionUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const existingReflection = await ctx.prisma.reflection.findUnique({
        where: { id: input.id },
        select: {
          subPlan: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (
        !existingReflection ||
        existingReflection.subPlan.userId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized access to this reflection.",
        });
      }

      const { id, ...data } = input;
      return ctx.prisma.reflection.update({
        where: { id },
        data,
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.reflection.findMany({
      where: {
        subPlan: {
          userId: ctx.user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
