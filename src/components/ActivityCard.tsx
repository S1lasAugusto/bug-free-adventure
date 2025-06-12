import Link from "next/link";
import { Activity } from "../server/schema/LearnerActivitySchema";
import { api } from "../utils/api";
import { BookOpen, Target, Code, ArrowRight, BarChart3 } from "lucide-react";

interface ActivityCardProps {
  type: string;
  bg: string;
  fillColor: string;
  moduleName?: string;
}

const ActivityCard = (props: ActivityCardProps) => {
  const {
    data: learnerAnalytics,
    isSuccess,
    isLoading,
  } = api.learnerActivityRouter.getLearnerActivity.useQuery();

  if (!isSuccess || isLoading) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="flex items-center justify-between">
            <div className="h-12 w-20 rounded bg-gray-200"></div>
            <div className="h-20 w-20 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const listOfExercises = [
    ...learnerAnalytics.activityAnalytics.challenges,
    ...learnerAnalytics.activityAnalytics.examples,
    ...learnerAnalytics.activityAnalytics.coding,
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EXAMPLE":
        return <BookOpen className="h-6 w-6" />;
      case "CHALLENGE":
        return <Target className="h-6 w-6" />;
      case "CODING":
        return <Code className="h-6 w-6" />;
      default:
        return <BarChart3 className="h-6 w-6" />;
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

  const totalCount = listOfExercises.filter(
    (e: Activity) =>
      props.type === e.type && props.moduleName === e.relatedTopic
  ).length;

  const completedCount = listOfExercises.filter((e: Activity) =>
    props.type === "EXAMPLE"
      ? props.type === e.type &&
        props.moduleName === e.relatedTopic &&
        e.visited
      : props.type === e.type &&
        props.moduleName === e.relatedTopic &&
        e.successRate > 0
  ).length;

  const percentage =
    totalCount > 0 ? Math.ceil((completedCount / totalCount) * 100) : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div
      className={`w-full rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${getTypeColor(
        props.type
      )}`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          {getTypeIcon(props.type)}
          <h3 className="text-lg font-bold text-gray-900">
            {props.type === "CODING"
              ? "Coding"
              : props.type.charAt(0) + props.type.slice(1).toLowerCase() + "s"}
          </h3>
        </div>
        <p className="mt-1 text-sm text-gray-600">{props.moduleName}</p>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          {/* Count */}
          <div>
            <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
            <div className="text-sm text-gray-600">
              {props.type === "CODING"
                ? "exercises"
                : props.type.toLowerCase() + "s"}
            </div>
          </div>

          {/* Progress Circle */}
          <div className="relative h-16 w-16">
            <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getProgressColor(percentage).split(" ")[0]}
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-900">
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>Completed</span>
            <span>
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                getProgressColor(percentage)
                  .split(" ")[0]
                  ?.replace("text-", "bg-") || "bg-gray-300"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={{
            pathname: `Java/${props.moduleName}/${props.type.toLowerCase()}`,
            query: {
              type:
                props.type === "CODING"
                  ? props.type.toLowerCase()
                  : props.type.toLowerCase() + "s",
            },
          }}
        >
          <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50">
            View All{" "}
            {props.type === "CODING"
              ? "Exercises"
              : props.type.charAt(0) + props.type.slice(1).toLowerCase() + "s"}
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ActivityCard;
