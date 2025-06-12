import {
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  Code,
  Activity,
} from "lucide-react";
import { type } from "@prisma/client";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { summary } from "date-streaks";

const Stats = () => {
  const {
    data: history,
    isLoading: historyIsLoading,
    isSuccess: historyIsSuccess,
  } = api.userRouter.getExerciseHistoryOnUser.useQuery();

  if (historyIsLoading || !historyIsSuccess) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-20 rounded bg-gray-200"></div>
            <div className="h-20 rounded bg-gray-200"></div>
            <div className="h-20 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const today = new Date(Date.now());

  const exercisesDoneLast7Days = history.filter(
    (e) =>
      e.completedAt !== null &&
      e.completedAt > sevenDaysAgo &&
      e.completedAt < today
  );
  const exercisesDone7DaysBefore = history.filter(
    (e) =>
      e.completedAt !== null &&
      e.completedAt > fourteenDaysAgo &&
      e.completedAt < sevenDaysAgo
  );

  const exerciseAttemptsLast7Days = (type: type) => {
    const attempts = history
      .filter(
        (e) =>
          e.ActivityResource.type == type &&
          e.completedAt !== null &&
          e.completedAt > sevenDaysAgo &&
          e.completedAt < today
      )
      .map((e) => e.attempts);

    const sum = attempts.reduce((a, b) => a! + b!, 0);
    return Math.round(sum ? sum / attempts.length : 0);
  };

  const exercisesAttempts7DaysBefore = (type: type) => {
    const attempts = history
      .filter(
        (e) =>
          e.ActivityResource.type == type &&
          e.completedAt !== null &&
          e.completedAt > fourteenDaysAgo &&
          e.completedAt < sevenDaysAgo
      )
      .map((e) => e.attempts);
    const sum = attempts.reduce((a, b) => a! + b!, 0);
    return Math.round(sum ? sum / attempts.length : 0);
  };

  const exerciseAttempts = (type: type) => {
    const attemptsLast7Days = exerciseAttemptsLast7Days(type);
    const attempts7DaysBefore = exercisesAttempts7DaysBefore(type);

    return {
      attemptsLast7Days: attemptsLast7Days,
      attempts7DaysBefore: attempts7DaysBefore,
      changeInPercentage: getProgress(attemptsLast7Days, attempts7DaysBefore),
    };
  };

  function getProgress(numberLast7Days: number, number7DaysBefore: number) {
    if (numberLast7Days === 0 && number7DaysBefore === 0) {
      return 0;
    }

    if (
      number7DaysBefore === 0 ||
      (number7DaysBefore === 1 && numberLast7Days !== 1)
    ) {
      return 100;
    }

    if (
      numberLast7Days === 0 ||
      (numberLast7Days === 1 && number7DaysBefore !== 1)
    ) {
      return 100;
    }

    return Math.round(
      ((number7DaysBefore - numberLast7Days) / numberLast7Days) * 100
    );
  }

  const StatsWithType = (
    type: string
  ): {
    doneLast7Days: number;
    done7DaysBefore: number;
    changeInPercentage: number;
  } => {
    const doneLast7Days = exercisesDoneLast7Days.filter(
      (e) => e.ActivityResource.type == type
    ).length;
    const done7DaysBefore = exercisesDone7DaysBefore.filter(
      (e) => e.ActivityResource.type == type
    ).length;
    const changeInPercentage = getProgress(done7DaysBefore, doneLast7Days);

    return {
      doneLast7Days: doneLast7Days,
      done7DaysBefore: done7DaysBefore,
      changeInPercentage: changeInPercentage,
    };
  };

  const datesDoneExercises = {
    dates: history.map((e) => e.completedAt) as Date[],
  };

  const currentStreak = summary(datesDoneExercises).currentStreak;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EXAMPLE":
        return <BookOpen className="h-5 w-5" />;
      case "CHALLENGE":
        return <Target className="h-5 w-5" />;
      case "CODING":
        return <Code className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EXAMPLE":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "CHALLENGE":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "CODING":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const StatCard = ({ type, title }: { type: string; title: string }) => {
    const stats = StatsWithType(type);
    const attempts = exerciseAttempts(type as type);
    const isPositive =
      stats.changeInPercentage > 0 &&
      stats.doneLast7Days > stats.done7DaysBefore;

    return (
      <div
        className={`rounded-xl border p-4 transition-all hover:shadow-md ${getTypeColor(
          type
        )}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(type)}
            <h3 className="text-sm font-semibold">{title}</h3>
          </div>
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              isPositive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(stats.changeInPercentage)}%
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {stats.doneLast7Days}
            </span>
            <span className="text-sm text-gray-600">completed</span>
          </div>
          <div className="text-xs text-gray-500">
            vs {stats.done7DaysBefore} last week
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Avg attempts:</span>
              <span className="font-semibold">
                {attempts.attemptsLast7Days}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="mb-2 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Performance Stats</h2>
        </div>
        <p className="text-sm text-gray-600">
          Last 7 days compared to previous week
        </p>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard type="EXAMPLE" title="Examples" />
          <StatCard type="CHALLENGE" title="Challenges" />
          <StatCard type="CODING" title="Coding" />
        </div>

        {/* Current Streak */}
        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              🔥
            </div>
            <div>
              <h3 className="font-semibold text-orange-900">Current Streak</h3>
              <p className="text-sm text-orange-700">
                Keep the momentum going!
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {currentStreak} day{currentStreak !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
