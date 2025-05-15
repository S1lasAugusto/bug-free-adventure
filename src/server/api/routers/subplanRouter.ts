import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// Schema para validação dos inputs do SubPlan
const subPlanSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  topic: z.string().min(1, "Tópico é obrigatório"),
  mastery: z.number().min(0).max(100).default(0),
  status: z.string().default("Active"),
  selectedDays: z.array(z.string()),
  selectedStrategies: z.array(z.string()),
  customStrategies: z.any().optional(),
  hoursPerDay: z.number().min(0).max(24).default(2),
});

const subPlanUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório").optional(),
  topic: z.string().min(1, "Tópico é obrigatório").optional(),
  mastery: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
  selectedDays: z.array(z.string()).optional(),
  selectedStrategies: z.array(z.string()).optional(),
  customStrategies: z.any().optional(),
  hoursPerDay: z.number().min(0).max(24).optional(),
});

export const subplanRouter = createTRPCRouter({
  // Obter todos os subplans do usuário atual
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const subplans = await ctx.prisma.subPlan.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return subplans;
  }),

  // Obter um subplan específico pelo ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const subplan = await ctx.prisma.subPlan.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!subplan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "SubPlan não encontrado",
        });
      }

      // Verificar se o subplan pertence ao usuário atual
      if (subplan.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso não autorizado a este SubPlan",
        });
      }

      return subplan;
    }),

  // Criar um novo subplan
  create: protectedProcedure
    .input(subPlanSchema)
    .mutation(async ({ ctx, input }) => {
      // Criação do subplan com os dados do input
      const subplan = await ctx.prisma.subPlan.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });

      return subplan;
    }),

  // Atualizar um subplan existente
  update: protectedProcedure
    .input(subPlanUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      // Verificar se o subplan existe e pertence ao usuário
      const existingSubplan = await ctx.prisma.subPlan.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingSubplan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "SubPlan não encontrado",
        });
      }

      if (existingSubplan.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso não autorizado a este SubPlan",
        });
      }

      // Extrair o ID do input
      const { id, ...updateData } = input;

      // Atualizar o subplan
      const updatedSubplan = await ctx.prisma.subPlan.update({
        where: {
          id,
        },
        data: updateData,
      });

      return updatedSubplan;
    }),

  // Excluir um subplan
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se o subplan existe e pertence ao usuário
      const existingSubplan = await ctx.prisma.subPlan.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingSubplan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "SubPlan não encontrado",
        });
      }

      if (existingSubplan.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso não autorizado a este SubPlan",
        });
      }

      // Excluir o subplan
      await ctx.prisma.subPlan.delete({
        where: {
          id: input.id,
        },
      });

      return { success: true };
    }),

  // Atualizar o status de um subplan (marcar como "Completed")
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verificar se o subplan existe e pertence ao usuário
      const existingSubplan = await ctx.prisma.subPlan.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingSubplan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "SubPlan não encontrado",
        });
      }

      if (existingSubplan.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso não autorizado a este SubPlan",
        });
      }

      // Atualizar apenas o status do subplan
      const updatedSubplan = await ctx.prisma.subPlan.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      return updatedSubplan;
    }),

  // Atualizar o nível de domínio (mastery) de um subplan
  updateMastery: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        mastery: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verificar se o subplan existe e pertence ao usuário
      const existingSubplan = await ctx.prisma.subPlan.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingSubplan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "SubPlan não encontrado",
        });
      }

      if (existingSubplan.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso não autorizado a este SubPlan",
        });
      }

      // Atualizar apenas o nível de domínio do subplan
      const updatedSubplan = await ctx.prisma.subPlan.update({
        where: {
          id: input.id,
        },
        data: {
          mastery: input.mastery,
        },
      });

      return updatedSubplan;
    }),
});
