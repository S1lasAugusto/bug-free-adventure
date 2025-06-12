import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import { useState } from "react";
import ActivityCard from "../../components/ActivityCard";
import Breadcrumbs from "../../components/Breadcrumbs";
import ExerciseCard from "../../components/ExerciseCard";
import ProgressionGrid from "../../components/ProgressionGrid";
import Timeline from "../../components/Timeline";
import { useUpdateExerciseHistory } from "../../hooks/useUpdateExerciseHistory";

import { Activity } from "../../server/schema/LearnerActivitySchema";
import { api } from "../../utils/api";

const ModuleStatistics = () => {
  const {
    data: learnerAnalytics,
    isSuccess,
    isLoading,
  } = api.learnerActivityRouter.getLearnerActivity.useQuery();

  const { user, isLoading: authLoading } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(
    undefined
  );

  const addExerciseHistoryMutation =
    api.userRouter.addExerciseHistoryToUser.useMutation();

  // This hook is used to set the previous data to the current data
  // when the current data is loaded. It is necesarry because we need to monitor when an exercise's successRate goes from 0 to >0.
  // This way we know when the user has completed the exercise.
  useUpdateExerciseHistory(learnerAnalytics, selectedActivity);

  const router = useRouter();

  const { module } = router.query;
  const { type } = router.query;

  if (isLoading || !isSuccess || authLoading) {
    return (
      <div className="mx-12 mt-36 flex grid animate-pulse grid-cols-4 gap-8">
        <div className="loading h-72 rounded"></div>
        <div className="loading h-72 rounded"></div>
        <div className="loading h-72 rounded"></div>
        <div className="loading h-72 rounded"></div>
        <div className="loading h-72 rounded"></div>
        <div className="loading h-72 rounded"></div>
        <div className="loading h-72 rounded"></div>
        <div className="loading h-72 rounded"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return <div>Unauthorized</div>;
  }

  const activities = learnerAnalytics.activityAnalytics;

  const typeofActivity = (): Activity[] => {
    switch (type) {
      case "challenges": {
        return learnerAnalytics.activityAnalytics.challenges.sort(
          (firstActivity, secondActivity) =>
            firstActivity.successRate > secondActivity.successRate
              ? 1
              : firstActivity.successRate === secondActivity.successRate
              ? firstActivity.attempts < secondActivity.attempts
                ? 1
                : -1
              : -1
        );
      }

      case "examples": {
        return learnerAnalytics.activityAnalytics.examples.sort(
          (firstActivity, secondActivity) => {
            if (firstActivity.visited && !secondActivity.visited) return 1;
            if (!firstActivity.visited && secondActivity.visited) return -1;
            return 0;
          }
        );
      }

      case "coding": {
        return learnerAnalytics.activityAnalytics.coding.sort(
          (firstActivity, secondActivity) =>
            firstActivity.successRate > secondActivity.successRate
              ? 1
              : firstActivity.successRate === secondActivity.successRate
              ? firstActivity.attempts < secondActivity.attempts
                ? 1
                : -1
              : -1
        );
      }

      default: {
        return [];
      }
    }
  };

  const description = learnerAnalytics.moduleAnalytics.find(
    (e) => e.name === module![1]
  )?.description;

  if (!type) {
    return (
      <div>
        <Breadcrumbs currentPage={module ? module[1] : "404"} />
        <div className="course-card mx-12 my-6 rounded-lg p-6">
          {description}
        </div>
        <div className="m-4 h-screen ">
          <div className="flex flex-row gap-16">
            <div className="w-1/2 space-y-8 pl-14 pt-2">
              <div className="text-color mb-4 text-lg font-semibold uppercase opacity-75">
                Recommended next steps
              </div>
              <Timeline
                learnerAnalytics={learnerAnalytics}
                recommendedActivities={[
                  ...activities.challenges,
                  ...activities.coding,
                  ...activities.examples,
                ].filter(
                  (e) => e.sequencing > 0 && e.relatedTopic === module![1]
                )}
              />
            </div>
            <div className="w-1/2 space-y-4 pt-2">
              <ActivityCard
                type="EXAMPLE"
                bg="bg-gradient-to-r from-[#3c3b95] via-[#44439f] to-[#3c3b95] "
                fillColor="#DE5B7E"
                moduleName={module ? module[1] : "404"}
              />
              <ActivityCard
                type="CHALLENGE"
                bg="bg-gradient-to-r from-[#9293cf] via-[#9a9bd0] to-[#9293cf]"
                fillColor="#988efe"
                moduleName={module ? module[1] : "404"}
              />
              <ActivityCard
                type="CODING"
                bg="bg-gradient-to-r from-[#5f80f4] via-[#6c8af3] to-[#5f80f4]"
                fillColor="#0de890"
                moduleName={module ? module[1] : "404"}
              />
            </div>
          </div>
          <ProgressionGrid currentPage={module ? module[1] : "404"} />
          <div className="h-80"></div>
        </div>
      </div>
    );
  }

  const desc = learnerAnalytics.moduleAnalytics.find(
    (e) => e.name === module![1]
  )?.name;

  return (
    <>
      <Breadcrumbs
        currentPage={module ? module[1] : "404"}
        currentType={type as string}
      />
      <div className="background-color mx-auto mt-6 w-full max-w-7xl overflow-x-auto rounded-lg p-4">
        <div className="flex flex-row flex-wrap items-center justify-end space-x-2 pb-4 pr-4 pt-6">
          <div className="h-4 w-4 items-center rounded-md bg-green-400 dark:bg-green-400"></div>
          <p className="text-sm">Finished</p>
          <div className="h-4 w-4 items-center rounded-md bg-[#fecd66]"></div>
          <p className="text-sm">Started</p>
          <div className="course-card h-4 w-4 items-center rounded-md"></div>
          <p className="text-sm">To do</p>
        </div>
        <div className="mx-auto my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {module
            ? typeofActivity()
                .filter((activity) => activity.relatedTopic == module[1])
                .map((activity) => {
                  return (
                    <a
                      key={activity.activityId}
                      target="_blank"
                      href={
                        activity.url +
                        "&usr=" +
                        user?.protusId +
                        "&grp=NorwaySpring2025A&sid=TEST&cid=352"
                      }
                      onClick={() => {
                        setSelectedActivity(activity.activityId);
                        addExerciseHistoryMutation.mutate({
                          activityId: activity.activityId,
                        });
                      }}
                      rel="noreferrer"
                    >
                      <ExerciseCard
                        name={activity.activityName}
                        type={activity.type}
                        successRate={activity.successRate}
                        attempts={activity.attempts}
                        visited={activity.visited}
                      />
                    </a>
                  );
                })
            : "404"}
        </div>
      </div>
    </>
  );
};

export default ModuleStatistics;
