import { PrismaClient, User } from "@prisma/client";
import { toJson } from "really-relaxed-json";
import { reMapLearnerActivityUtil } from "../../bff/learnerActivityUtil";
import {
  learnerActivitySchema,
  LearnerAnalyticsAPIResponse,
} from "../../schema/LearnerActivitySchema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const learnerActivity = async (prisma: PrismaClient, user: User) => {
  // Verificar se o usuário tem protusId
  if (!user.protusId) {
    // Retornar dados vazios mas válidos se o usuário não tem protusId
    return {
      learner: {
        id: user.id,
        name: user.name,
        lastActivityId: "",
      },
      moduleAnalytics: [],
      activityAnalytics: {
        examples: [],
        challenges: [],
        coding: [],
      },
    };
  }

  const externalAPIURL = `http://adapt2.sis.pitt.edu/aggregate2/GetContentLevels?usr=${
    user.protusId
  }&grp=${
    user.group || "norwaySpring2026"
  }&mod=user&sid=TEST&cid=352&lastActivityId=while_loops.j_digits&res=-1`;

  try {
    const unfilteredAPI = await fetch(externalAPIURL)
      .then((response) => response.text())
      .then((text) => toJson(text))
      .then((j) => JSON.parse(j));

    const activityResources = await prisma.activityResource.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        relation: {
          select: {
            description: true,
            moduleName: true,
          },
        },
      },
    });

    const api = reMapLearnerActivityUtil(
      unfilteredAPI,
      activityResources
    ) as LearnerAnalyticsAPIResponse;

    return learnerActivitySchema.parse(api);
  } catch (error) {
    console.error("Erro ao buscar dados da API externa:", error);
    // Retornar dados vazios mas válidos em caso de erro
    return {
      learner: {
        id: user.id,
        name: user.name,
        lastActivityId: "",
      },
      moduleAnalytics: [],
      activityAnalytics: {
        examples: [],
        challenges: [],
        coding: [],
      },
    };
  }
};

export const learnerActivityRouter = createTRPCRouter({
  getLearnerActivity: protectedProcedure.query(async ({ ctx }) => {
    // Verificar se o usuário tem protusId
    if (!ctx.user.protusId) {
      // Retornar dados vazios mas válidos se o usuário não tem protusId
      return {
        learner: {
          id: ctx.user.id,
          name: ctx.user.name,
          lastActivityId: "",
        },
        moduleAnalytics: [],
        activityAnalytics: {
          examples: [],
          challenges: [],
          coding: [],
        },
      };
    }

    const externalAPIURL = `http://adapt2.sis.pitt.edu/aggregate2/GetContentLevels?usr=${
      ctx.user.protusId
    }&grp=${
      ctx.user.group || "norwaySpring2026"
    }&mod=user&sid=TEST&cid=352&lastActivityId=while_loops.j_digits&res=-1`;

    try {
      const unfilteredAPI = await fetch(externalAPIURL)
        .then((response) => response.text())
        .then((text) => toJson(text))
        .then((j) => JSON.parse(j));

      const activityResources = await ctx.prisma.activityResource.findMany({
        select: {
          id: true,
          name: true,
          url: true,
          relation: {
            select: {
              description: true,
              moduleName: true,
            },
          },
        },
      });

      const api = reMapLearnerActivityUtil(
        unfilteredAPI,
        activityResources
      ) as LearnerAnalyticsAPIResponse;

      return learnerActivitySchema.parse(api);
    } catch (error) {
      console.error("Erro ao buscar dados da API externa:", error);
      // Retornar dados vazios mas válidos em caso de erro
      return {
        learner: {
          id: ctx.user.id,
          name: ctx.user.name,
          lastActivityId: "",
        },
        moduleAnalytics: [],
        activityAnalytics: {
          examples: [],
          challenges: [],
          coding: [],
        },
      };
    }
  }),
});
