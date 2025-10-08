import { zodResolver } from "@hookform/resolvers/zod";
import { SelectedEnum } from "@prisma/client";
import { Checkbox } from "flowbite-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, get } from "react-hook-form";
import { HiUser } from "react-icons/hi";
import ExerciseHistoryPreview from "../../components/previews/ExerciseHistoryPreview";
import HistoryGraphPreview from "../../components/previews/HistoryGraphPreview";
import LeaderboardPreview from "../../components/previews/LeaderboardPreview";
import StatsPreview from "../../components/previews/StatsPreview";
import {
  UserPreferenceForm,
  userPreferenceSchema,
} from "../../server/schema/UserSchema";
import { api } from "../../utils/api";
import { Brain, BookOpen, Target, Clock } from "lucide-react";

const Settings: NextPage = () => {
  const {
    data: userPreferences,
    isSuccess: selectedSuccess,
    isLoading: selectedLoading,
  } = api.userRouter.getUserPreferences.useQuery();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<UserPreferenceForm>({
    defaultValues: {
      newSelectedComponents: userPreferences?.selectedComponents,
      leaderboard: userPreferences?.leaderboard,
    },
    resolver: zodResolver(userPreferenceSchema),
  });

  const [checkboxIndexes, setCheckboxIndexes] = useState<SelectedEnum[]>([]);
  const [checkedLeaderboard, setCheckedLeaderboard] = useState(false);
  useEffect(() => {
    if (userPreferences) {
      setValue("newSelectedComponents", userPreferences.selectedComponents);
      setValue("leaderboard", userPreferences.leaderboard);
      setCheckboxIndexes(userPreferences.selectedComponents);
      setCheckedLeaderboard(userPreferences.leaderboard);
    }
  }, [userPreferences, setValue]);

  const mutation = api.userRouter.updateUserPreferences.useMutation();

  const router = useRouter();

  const ctx = api.useContext();

  if (!selectedSuccess || selectedLoading) {
    return <div></div>;
  }

  const onSubmit: SubmitHandler<UserPreferenceForm> = (
    data: UserPreferenceForm
  ) => {
    mutation.mutate(data, {
      onSuccess: () => {
        ctx.invalidate();
        router.reload();
      },
    });
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="background-color col-span-4 mr-4 h-screen w-11/12 rounded-r-lg p-16 ">
      <h1 className="text-color mb-6 text-xl font-semibold uppercase opacity-75">
        My chosen components
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 grid select-none grid-cols-2 gap-x-8 gap-y-4 ">
          <div
            className={classNames(
              checkboxIndexes.includes(SelectedEnum.HISTORYGRAPH)
                ? "border-[#0de890] dark:border-[#0de890]"
                : "border-zinc-400 dark:border-zinc-600",
              " course-card relative h-auto grid-cols-1 rounded-2xl border border-2  px-6 pt-6"
            )}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight">
              History Graph
            </h5>

            <p className="col-start-1 text-sm text-gray-700 dark:text-gray-400">
              This component shows you how much you work per day reprented as a
              graph.
            </p>
            <div className="scale-90">
              <HistoryGraphPreview />
            </div>
            <div className="absolute bottom-1 my-6 ml-4 flex items-center gap-2">
              <Checkbox
                defaultChecked={userPreferences?.selectedComponents?.includes(
                  SelectedEnum.HISTORYGRAPH
                )}
                onClick={() =>
                  checkboxIndexes?.includes(SelectedEnum.HISTORYGRAPH)
                    ? setCheckboxIndexes(
                        checkboxIndexes.filter(
                          (e) => e !== SelectedEnum.HISTORYGRAPH
                        )
                      )
                    : setCheckboxIndexes([
                        ...checkboxIndexes,
                        SelectedEnum.HISTORYGRAPH,
                      ])
                }
                {...register("newSelectedComponents")}
                id="select"
                value={SelectedEnum.HISTORYGRAPH}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                required={false}
              />

              <label htmlFor="select">Select</label>
            </div>
          </div>
          <div
            className={classNames(
              checkboxIndexes.includes(SelectedEnum.STATS)
                ? "border-[#0de890] dark:border-[#0de890]"
                : "border-zinc-400 dark:border-zinc-600",
              " course-card relative h-auto grid-cols-1 rounded-2xl border border-2  px-6 pt-6"
            )}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight">Stats</h5>

            <p className="col-start-1 text-sm text-gray-700 dark:text-gray-400">
              This component shows you some stats about the work you have put in
              the previous week compared to the week before.
            </p>
            <div className="scale-90">
              <StatsPreview />
            </div>
            <div className="absolute bottom-1 my-6 ml-4 flex items-center gap-2 ">
              <Checkbox
                onClick={() =>
                  checkboxIndexes?.includes(SelectedEnum.STATS)
                    ? setCheckboxIndexes(
                        checkboxIndexes.filter((e) => e !== SelectedEnum.STATS)
                      )
                    : setCheckboxIndexes([
                        ...checkboxIndexes,
                        SelectedEnum.STATS,
                      ])
                }
                defaultChecked={userPreferences?.selectedComponents?.includes(
                  SelectedEnum.STATS
                )}
                {...register("newSelectedComponents")}
                id="select"
                value={SelectedEnum.STATS}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                required={false}
              />

              <label htmlFor="select">Select</label>
            </div>
          </div>

          <div
            className={classNames(
              checkboxIndexes.includes(SelectedEnum.EXERCISEHISTORY)
                ? "border-[#0de890] dark:border-[#0de890]"
                : "border-zinc-400 dark:border-zinc-600",
              " course-card relative h-auto grid-cols-1 rounded-2xl border border-2  px-6 pt-6"
            )}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight">
              Activity History
            </h5>

            <p className="col-start-1 text-sm text-gray-700 dark:text-gray-400">
              This component is more detailed than Activity Graph. It shows your
              exercise activty per day, as a list.
            </p>
            <div className="mb-6 scale-90">
              <ExerciseHistoryPreview />
            </div>
            <div className="absolute bottom-1 my-6 ml-4 flex items-center gap-2 ">
              <Checkbox
                onClick={() =>
                  checkboxIndexes?.includes(SelectedEnum.EXERCISEHISTORY)
                    ? setCheckboxIndexes(
                        checkboxIndexes.filter(
                          (e) => e !== SelectedEnum.EXERCISEHISTORY
                        )
                      )
                    : setCheckboxIndexes([
                        ...checkboxIndexes,
                        SelectedEnum.EXERCISEHISTORY,
                      ])
                }
                defaultChecked={userPreferences?.selectedComponents?.includes(
                  SelectedEnum.EXERCISEHISTORY
                )}
                {...register("newSelectedComponents")}
                id="select"
                value={SelectedEnum.EXERCISEHISTORY}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                required={false}
              />

              <label htmlFor="select">Select</label>
            </div>
          </div>

          <div
            className={classNames(
              checkboxIndexes.includes(SelectedEnum.REGULA)
                ? "border-[#0de890] dark:border-[#0de890]"
                : "border-zinc-400 dark:border-zinc-600",
              " course-card relative h-auto grid-cols-1 rounded-2xl border border-2 px-6 pb-16 pt-6"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <h5 className="text-2xl font-bold tracking-tight">Regula</h5>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Active
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              Manage your learning autonomously and efficiently with
              self-regulation tools.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">
                  Study Plan
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">Goals</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">
                  Progress
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">
                  Strategies
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 left-6 flex items-center gap-2">
              <Checkbox
                onClick={() =>
                  checkboxIndexes?.includes(SelectedEnum.REGULA)
                    ? setCheckboxIndexes(
                        checkboxIndexes.filter((e) => e !== SelectedEnum.REGULA)
                      )
                    : setCheckboxIndexes([
                        ...checkboxIndexes,
                        SelectedEnum.REGULA,
                      ])
                }
                {...register("newSelectedComponents")}
                id="select"
                value={SelectedEnum.REGULA}
                defaultChecked={userPreferences?.selectedComponents?.includes(
                  SelectedEnum.REGULA
                )}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                required={false}
              />
              <label
                htmlFor="select"
                className="text-sm font-medium text-gray-700"
              >
                Select
              </label>
            </div>
          </div>
        </div>

        <p className="text-color mb-6 mt-8 text-xl font-semibold uppercase opacity-75">
          Leaderboard participation
        </p>
        <div
          className={classNames(
            userPreferences?.leaderboard == true
              ? "border-[#0de890] dark:border-[#0de890]"
              : " border-zinc-400 dark:border-zinc-600",
            "W-3/5  course-card relative rounded-2xl border-2 px-6 pt-6"
          )}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight">
            Leaderboard
          </h5>
          <div className="grid grid-cols-2 gap-2">
            <div className=" col-start-1 text-sm text-gray-700 dark:text-gray-400">
              I would like to participate in the leaderboard
              {checkedLeaderboard && (
                <div className="">
                  <h2 className="text-md pt-4 font-medium leading-6">
                    Your nickname will be displayed publicly on the leaderboard.
                  </h2>
                  <label
                    htmlFor="name"
                    className="block pt-6 text-sm font-medium"
                  >
                    Nickname
                  </label>
                  <div className="mt-1 flex rounded-md">
                    <div className="flex w-1/5">
                      <span
                        className={classNames(
                          errors.name
                            ? "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100"
                            : " border-zinc-300 bg-zinc-200  text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-400",
                          "inline-flex items-center rounded-l-md border border-r-0 px-3 text-sm"
                        )}
                      >
                        <HiUser
                          className={
                            errors.name
                              ? " text-red-700"
                              : "text-gray-600 dark:text-gray-200"
                          }
                        />
                      </span>
                      <input
                        {...register("name")}
                        type="text"
                        defaultValue={userPreferences?.user?.name || ""}
                        id="name"
                        className={classNames(
                          errors.name
                            ? "border-red-500 bg-red-50 p-2.5 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100"
                            : "border-zinc-300 bg-gray-50 text-gray-900  focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600  dark:bg-gray-700 dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
                          "block flex-1 rounded-none rounded-r-lg border p-2.5 text-sm"
                        )}
                        placeholder="Ola"
                        required={false}
                      />
                    </div>
                  </div>
                  {Object.values(errors).map((error) => (
                    <span key={error?.type}>{error?.message}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="col-start-2 scale-90">
              <LeaderboardPreview />
            </div>
            <div className="absolute bottom-1 my-6 ml-4 flex items-center gap-2 ">
              <Checkbox
                onClick={() => setCheckedLeaderboard(!checkedLeaderboard)}
                checked={checkedLeaderboard}
                defaultChecked={userPreferences?.leaderboard}
                {...register("leaderboard")}
                id="select"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                required={false}
              />

              <label htmlFor="select">Select</label>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <input
            className="mt-8 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
            value={
              mutation.isLoading
                ? "Loading.."
                : mutation.isSuccess
                ? "Success!"
                : "Submit changes"
            }
          />
        </div>
        <div className="background-color h-16"></div>
      </form>
    </div>
  );
};

export default Settings;
