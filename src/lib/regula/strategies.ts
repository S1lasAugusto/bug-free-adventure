export interface StrategyDefinition {
  id: string;
  name: string;
  description: string;
}

export interface CustomStrategyDefinition {
  id: string;
  name: string;
  description?: string;
}

export const DEFAULT_STRATEGIES: StrategyDefinition[] = [
  {
    id: "pomodoro",
    name: "Pomodoro Technique",
    description: "Work for 25 minutes, then take a 5-minute break",
  },
  {
    id: "spaced_repetition",
    name: "Spaced Repetition",
    description: "Review material at increasing intervals",
  },
  {
    id: "active_recall",
    name: "Active Recall",
    description: "Test yourself on the material",
  },
  {
    id: "mind_mapping",
    name: "Mind Mapping",
    description: "Visualize concepts and connections",
  },
  {
    id: "feynman",
    name: "Feynman Technique",
    description: "Explain concepts in simple terms",
  },
  {
    id: "cornell",
    name: "Cornell Note-Taking",
    description: "Structured note-taking method",
  },
  {
    id: "group_study",
    name: "Group Study",
    description: "Study with peers for discussion",
  },
  {
    id: "practice_tests",
    name: "Practice Tests",
    description: "Take mock exams to practice",
  },
  {
    id: "practice_by_teaching",
    name: "Practice by Teaching",
    description:
      "Reinforce your understanding by teaching the material to someone else.",
  },
  {
    id: "self_explanation",
    name: "Self Explanation",
    description:
      "Explain concepts to yourself in your own words to deepen understanding.",
  },
  {
    id: "concrete_examples",
    name: "Concrete Examples",
    description:
      "Use specific examples to make abstract concepts more tangible.",
  },
  {
    id: "interleaving",
    name: "Interleaving",
    description: "Mix different topics or problem types in one study session.",
  },
  {
    id: "dual_coding",
    name: "Dual Coding",
    description: "Combine words and visuals to improve retention.",
  },
  {
    id: "elaboration",
    name: "Elaboration",
    description:
      "Expand ideas by connecting new concepts with what you already know.",
  },
];

const LEGACY_STRATEGY_IDS: Record<string, string> = {
  pomodoro_technique: "pomodoro",
  feynman_technique: "feynman",
  retrieval_practice: "active_recall",
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const normalizeStrategyId = (value: string) =>
  LEGACY_STRATEGY_IDS[value] ?? value;

export const normalizeStrategyIds = (values: string[] = []) =>
  values.map(normalizeStrategyId);

export const formatStrategyName = (strategy: string) =>
  strategy
    .replace(/^custom_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const normalizeCustomStrategies = (
  customStrategies: unknown
): CustomStrategyDefinition[] => {
  if (!customStrategies) return [];

  if (Array.isArray(customStrategies)) {
    return customStrategies
      .map((item, index) => {
        if (!item) return null;
        if (typeof item === "string") {
          const slug = toSlug(item) || `custom_${index}`;
          return { id: `custom_${slug}`, name: item };
        }
        if (typeof item === "object" && "name" in item) {
          const name = String(item.name ?? "").trim();
          if (!name) return null;
          const description =
            "description" in item && item.description != null
              ? String(item.description)
              : undefined;
          const customId =
            "id" in item && item.id != null
              ? String(item.id)
              : `custom_${toSlug(name)}`;
          return { id: customId, name, description };
        }
        return null;
      })
      .filter((item): item is CustomStrategyDefinition => Boolean(item));
  }

  if (typeof customStrategies === "object") {
    return Object.entries(customStrategies as Record<string, unknown>)
      .map(([key, value], index) => {
        if (typeof value === "string") {
          const id = key.startsWith("custom_")
            ? key
            : `custom_${toSlug(key) || index}`;
          return { id, name: key, description: value };
        }
        if (value && typeof value === "object") {
          const name =
            "name" in (value as Record<string, unknown>) &&
            (value as Record<string, unknown>).name
              ? String((value as Record<string, unknown>).name)
              : key;
          const description =
            "description" in (value as Record<string, unknown>) &&
            (value as Record<string, unknown>).description != null
              ? String((value as Record<string, unknown>).description)
              : undefined;
          const id = key.startsWith("custom_")
            ? key
            : `custom_${toSlug(name) || index}`;
          return { id, name, description };
        }
        return null;
      })
      .filter((item): item is CustomStrategyDefinition => Boolean(item));
  }

  return [];
};

export const buildCustomStrategiesPayload = (
  customStrategies: CustomStrategyDefinition[]
) =>
  customStrategies.reduce<
    Record<string, { name: string; description?: string }>
  >((acc, strategy, index) => {
    const id =
      strategy.id && strategy.id.startsWith("custom_")
        ? strategy.id
        : `custom_${toSlug(strategy.name) || index}`;
    acc[id] = {
      name: strategy.name,
      description: strategy.description?.trim() || undefined,
    };
    return acc;
  }, {});

export const resolveStrategyDisplay = (
  strategyId: string,
  customStrategies: CustomStrategyDefinition[]
) => {
  const normalizedId = normalizeStrategyId(strategyId);
  const defaultStrategy = DEFAULT_STRATEGIES.find(
    (strategy) => strategy.id === normalizedId
  );

  if (defaultStrategy) {
    return defaultStrategy;
  }

  const customStrategy = customStrategies.find(
    (strategy) =>
      strategy.id === normalizedId ||
      strategy.id === strategyId ||
      normalizeStrategyId(strategy.id) === normalizedId
  );

  if (customStrategy) {
    return {
      id: customStrategy.id,
      name: customStrategy.name,
      description:
        customStrategy.description ?? "No description available yet.",
    };
  }

  return {
    id: normalizedId,
    name: formatStrategyName(normalizedId),
    description: "No description available yet.",
  };
};
