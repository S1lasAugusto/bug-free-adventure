/**
 * This is the client-side entrypoint for your tRPC API.
 * It's used to create the `api` object which contains the Next.js App-wrapper
 * as well as your typesafe react-query hooks.
 *
 * We also create a few inference helpers for input and output types
 */
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "../server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

// Logger personalizado para depuração
const customLogger = (opts: {
  direction: "up" | "down";
  path: string;
  type: "query" | "mutation" | "subscription";
  input?: unknown;
  result?: unknown;
  error?: Error;
}) => {
  const { direction, path, type, input, result, error } = opts;

  // Log detalhado
  if (direction === "up") {
    console.log(`[TRPC-CLIENT] Enviando ${type} para ${path}`, { input });
  } else {
    if (error) {
      console.error(`[TRPC-CLIENT] Erro no ${type} em ${path}:`, error);
      console.error("[TRPC-CLIENT] Detalhes do erro:", {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.log(`[TRPC-CLIENT] Resposta de ${path}:`, { result });
    }
  }

  return { direction, path, type, input, result, error };
};

/**
 * A set of typesafe react-query hooks for your tRPC API
 */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server
       * @see https://trpc.io/docs/data-transformers
       **/
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server
       * @see https://trpc.io/docs/links
       * */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          logger: customLogger,
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            // Adicionar token de autenticação nos headers se existir
            const token =
              typeof window !== "undefined"
                ? localStorage.getItem("auth-token")
                : null;
            return {
              Authorization: token ? `Bearer ${token}` : "",
            };
          },
          // Adicionar logs para depurar problemas de rede
          fetch: async (url, options) => {
            console.log(`[TRPC-CLIENT] Fetch iniciando para ${url}`);
            try {
              const response = await fetch(url, options);
              console.log(
                `[TRPC-CLIENT] Fetch concluído: status ${response.status}`
              );
              return response;
            } catch (error) {
              console.error(`[TRPC-CLIENT] Erro no fetch:`, error);
              throw error;
            }
          },
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
