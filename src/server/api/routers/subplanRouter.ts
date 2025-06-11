import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
  // Procedimento de teste para verificar se a comunicação está funcionando
  test: publicProcedure.query(() => {
    console.log("[SERVER] subplanRouter.test - Procedimento de teste chamado");
    return {
      success: true,
      message: "Procedimento de teste foi executado com sucesso",
      timestamp: new Date().toISOString(),
    };
  }),

  // Obter todos os subplans do usuário atual
  getAll: protectedProcedure.query(async ({ ctx }) => {
    console.log("[SERVER] getAll - Sessão:", ctx.session);
    console.log("[SERVER] getAll - ID do usuário:", ctx.user.id);

    try {
      const subplans = await ctx.prisma.subPlan.findMany({
        where: {
          userId: ctx.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log("[SERVER] getAll - Subplans encontrados:", subplans.length);
      return subplans;
    } catch (error) {
      console.error("[SERVER] getAll - Erro ao buscar subplans:", error);
      throw error;
    }
  }),

  // Obter um subplan específico pelo ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("[SERVER] getById - ID do subplan requisitado:", input.id);

      try {
        const subplan = await ctx.prisma.subPlan.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!subplan) {
          console.error("[SERVER] getById - SubPlan não encontrado");
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "SubPlan não encontrado",
          });
        }

        // Verificar se o subplan pertence ao usuário atual
        if (subplan.userId !== ctx.user.id) {
          console.error("[SERVER] getById - Acesso não autorizado");
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Acesso não autorizado a este SubPlan",
          });
        }

        console.log("[SERVER] getById - SubPlan encontrado");
        return subplan;
      } catch (error) {
        console.error("[SERVER] getById - Erro:", error);
        throw error;
      }
    }),

  // Criar um novo subplan
  create: protectedProcedure
    .input(subPlanSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("[SERVER] create - Iniciando criação de subplan");
      console.log("[SERVER] create - Dados recebidos:", input);
      console.log("[SERVER] create - ID do usuário:", ctx.user.id);

      try {
        // Verificar conexão com o banco
        await ctx.prisma.$queryRaw`SELECT 1`;
        console.log("[SERVER] create - Conexão com o banco OK");

        // Tratar customStrategies: substituir null por undefined
        const processedInput = {
          ...input,
          // Se customStrategies for null, não incluir na requisição (será undefined)
          ...(input.customStrategies === null
            ? { customStrategies: undefined }
            : {}),
        };

        console.log("[SERVER] create - Dados processados:", processedInput);

        // Criação do subplan com os dados do input
        const subplan = await ctx.prisma.subPlan.create({
          data: {
            ...processedInput,
            userId: ctx.user.id,
          },
        });

        console.log(
          "[SERVER] create - SubPlan criado com sucesso:",
          subplan.id
        );
        return subplan;
      } catch (error) {
        console.error("[SERVER] create - Erro ao criar subplan:", error);
        throw error;
      }
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

      if (existingSubplan.userId !== ctx.user.id) {
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
      // Primeiro deleta todas as reflections associadas
      await ctx.prisma.reflection.deleteMany({
        where: {
          subPlanId: input.id,
        },
      });

      // Depois deleta o subplan
      return ctx.prisma.subPlan.delete({
        where: {
          id: input.id,
        },
      });
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

      if (existingSubplan.userId !== ctx.user.id) {
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

      if (existingSubplan.userId !== ctx.user.id) {
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
