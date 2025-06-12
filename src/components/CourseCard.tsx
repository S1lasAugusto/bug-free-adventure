import { CommandLineIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Activity } from "../server/schema/LearnerActivitySchema";
import { api } from "../utils/api";

const CourseCard = ({ courseName }: { courseName: string }) => {
  const router = useRouter();

  const {
    data: learnerAnalytics,
    isSuccess,
    isLoading,
  } = api.learnerActivityRouter.getLearnerActivity.useQuery();

  if (!isSuccess || isLoading) {
    return (
      <div className="w-full rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="mb-4 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  const listOfExercises = [
    ...learnerAnalytics.activityAnalytics.challenges,
    ...learnerAnalytics.activityAnalytics.examples,
    ...learnerAnalytics.activityAnalytics.coding,
  ];

  const onClick = async (target: string, e: React.MouseEvent) => {
    e.preventDefault();
    await router.push(target);
  };

  const exercisesDone = listOfExercises.filter(
    (e: Activity) =>
      (e.type === "EXAMPLE" && e.visited) ||
      ((e.type === "CHALLENGE" || e.type === "CODING") && e.successRate > 0)
  ).length;

  const allExercises = listOfExercises.length;
  const progressPercentage = Math.round((exercisesDone / allExercises) * 100);

  return (
    <div
      onClick={(e) => onClick("/courses/Java", e)}
      className="group w-full cursor-pointer rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800 dark:shadow-lg"
    >
      {/* Header */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <CommandLineIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {courseName.toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Programming Course
          </p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="mb-4 space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {exercisesDone}
          </span>
          <span className="text-lg text-gray-500 dark:text-gray-400">
            / {allExercises}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            tasks completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {progressPercentage}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Active
          </span>
        </div>
        <div className="text-xs text-gray-500 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400">
          Click to view →
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
