import { Prisma, PrismaClient, SelectedEnum, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Leaderboard from "../../../components/Leaderboard";
import {
  onboardingSchema,
  selectedComps,
  selectedCompsEnum,
  userPreferenceSchema,
} from "../../schema/UserSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { learnerActivity } from "./learnerActivityRouter";

const updateUserName = async (
  prisma: PrismaClient,
  userId: string,
  name: string | undefined,
  leaderboard: boolean
) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: name,
      leaderboard: leaderboard,
    },
  });
};

export const userRouter = createTRPCRouter({
  getLeaderBoard: publicProcedure.query(async ({ ctx }) => {
    const leaderboardUsers = await ctx.prisma.user.findMany({
      where: {
        leaderboard: true,
      },
      include: {
        history: {
          where: {
            NOT: {
              completedAt: null,
            },
          },
        },
      },
    });

    return leaderboardUsers
      .map((user) => {
        return {
          name: user.name,
          userId: user.id,
          score: user.history.length,
        };
      })
      .sort((a, b) => b.score - a.score);
  }),
  submitOnboarding: protectedProcedure
    .input(onboardingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const defaultGroup = await ctx.prisma.setting.findUnique({
          where: { key: "defaultGroup" },
        });

        // Garantir que o protusId tenha o prefixo 'norway' se for um número mas não adicionar se já for string com prefixo
        const formattedProtusId = `norway${input.protusId}`;

        const user = await ctx.prisma.user.update({
          where: {
            id: ctx.user.id,
          },
          include: {
            preferences: true,
          },
          data: {
            name: input.name,
            USNEmail: input.USNEmail,
            protusId: formattedProtusId,
            group: defaultGroup?.value || "norwaySpring2026",
            leaderboard: input.leaderboard,
            onBoarded: true,
            preferences: {
              create: {
                selectedComponents: {
                  set: input.selectedComponents as selectedCompsEnum[],
                },
                leaderboard: input.leaderboard,
              },
            },
          },
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          // P2022: Unique constraint failed
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Id already exists. Check your ID",
            });
          }
        }
        throw e;
      }
    }),

  getUserPreferences: protectedProcedure.query(async ({ ctx }) => {
    const preferences = await ctx.prisma.userPreference.findMany({
      where: { userId: ctx.user.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    if (preferences.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "User preferences not found. Please complete onboarding first.",
      });
    }

    return preferences[0];
  }),

  updateUserPreferences: protectedProcedure
    .input(userPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userPreference.create({
        data: {
          userId: ctx.user.id,
          selectedComponents: input.newSelectedComponents,
          createdAt: new Date(),
          leaderboard: input.leaderboard,
        },
      });
      updateUserName(ctx.prisma, ctx.user.id, input.name, input.leaderboard);
    }),
  getLastUnfinishedActivity: protectedProcedure.query(async ({ ctx }) => {
    const unfinishedActivity = await ctx.prisma.exerciseHistory.findMany({
      where: {
        userId: ctx.user.id,
        completedAt: null,
      },
      include: {
        ActivityResource: { include: { relation: true } },
        user: true,
      },
      orderBy: {
        visitedAt: "desc",
      },
      take: 1,
    });

    if (unfinishedActivity.length === 0) {
      return null;
    }

    return unfinishedActivity[0];
  }),

  getExerciseHistoryOnUser: protectedProcedure.query(async ({ ctx }) => {
    const history = await ctx.prisma.exerciseHistory.findMany({
      where: {
        userId: ctx.user.id,
        NOT: {
          completedAt: null,
        },
      },
      include: {
        ActivityResource: true,
      },
    });

    return history;
  }),
  addExerciseHistoryToUser: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.exerciseHistory.upsert({
        where: {
          userExerciseHistoryOnActivityResource: {
            userId: ctx.user.id,
            activityResourceId: input.activityId,
          },
        },
        create: {
          userId: ctx.user.id,
          activityResourceId: input.activityId,
          visitedAt: new Date(),
        },
        update: {},
      });
    }),
  updateExerciseHistory: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Buscar o usuário completo do banco
      const fullUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
      });

      if (!fullUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const activityAnalytics = (await learnerActivity(ctx.prisma, fullUser))
        .activityAnalytics;

      const attempts = [
        ...activityAnalytics.challenges,
        ...activityAnalytics.examples,
        ...activityAnalytics.coding,
      ].find((e) => e.activityId === input.activityId)?.attempts;

      return await ctx.prisma.exerciseHistory.update({
        where: {
          userExerciseHistoryOnActivityResource: {
            userId: ctx.user.id,
            activityResourceId: input.activityId,
          },
        },
        data: {
          completedAt: new Date(),
          attempts: attempts,
        },
      });
    }),
});
