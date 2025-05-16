import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";

// API handler para tRPC
const handler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `[API] 🔴 tRPC Error em ${path ?? "<caminho desconhecido>"}:`,
            error
          );
          console.error("[API] Stack de erro completo:", error.stack);
          console.error("[API] Contexto do erro:", {
            code: error.code,
            message: error.message,
            data: error.data,
          });
        }
      : undefined,
});

export default handler;
