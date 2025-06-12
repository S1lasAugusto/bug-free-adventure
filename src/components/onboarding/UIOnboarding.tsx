import { SelectedEnum } from "@prisma/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingForm,
  onboardingSchema,
} from "../../server/schema/UserSchema";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Hash,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Import dos componentes preview
import LeaderboardPreview from "../previews/LeaderboardPreview";
import ExercisePlannerPreview from "../previews/ExercisePlannerPreview";
import HistoryGraphPreview from "../previews/HistoryGraphPreview";
import ExerciseHistoryPreview from "../previews/ExerciseHistoryPreview";
import StatsPreview from "../previews/StatsPreview";
import RegulaPreview from "../previews/RegulaPreview";

const UIOnboarding = () => {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      selectedComponents: [],
    },
  });

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const showNameField = watch("leaderboard");
  const selectedComponents = watch("selectedComponents");
  const ctx = api.useContext();
  const mutation = api.userRouter.submitOnboarding.useMutation();

  const handleComponentToggle = (componentId: string) => {
    const currentSelected = getValues("selectedComponents") || [];
    const isSelected = currentSelected.includes(componentId);

    if (isSelected) {
      // Remove o componente
      const newSelected = currentSelected.filter((id) => id !== componentId);
      setValue("selectedComponents", newSelected);
    } else {
      // Adiciona o componente
      setValue("selectedComponents", [...currentSelected, componentId]);
    }
  };

  const validateAndNextStep = async () => {
    const valid = await trigger(["USNEmail", "protusId"]);
    if (valid) {
      setCurrentStep(2);
    }
  };

  const onSubmit: SubmitHandler<OnboardingForm> = (data: OnboardingForm) => {
    mutation.mutate(data, {
      onSuccess: () => {
        ctx.invalidate();
        router.reload();
      },
    });
  };

  const components = [
    {
      id: SelectedEnum.STATS,
      title: "Stats Dashboard",
      description:
        "Track your progress with detailed statistics and performance metrics.",
      preview: <StatsPreview />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: SelectedEnum.TODO,
      title: "Task Planner",
      description:
        "Organize your assignments and deadlines with our smart planner.",
      preview: <ExercisePlannerPreview />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: SelectedEnum.EXERCISEHISTORY,
      title: "Exercise History",
      description:
        "Keep track of all your completed exercises and achievements.",
      preview: <ExerciseHistoryPreview />,
      color: "from-orange-500 to-red-500",
    },
    {
      id: SelectedEnum.REGULA,
      title: "Regula",
      description:
        "Self-regulation tools to help you learn more effectively and autonomously.",
      preview: <RegulaPreview />,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: SelectedEnum.HISTORYGRAPH,
      title: "Activity Graph",
      description:
        "Visualize your daily activity with interactive charts and graphs.",
      preview: <HistoryGraphPreview />,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header com progresso */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Welcome to Progressor!
          </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s set up your personalized learning dashboard
          </p>

          {/* Progress bar */}
          <div className="mx-auto mt-6 w-full max-w-md">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}% complete</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Personal Information
                  </h2>
                  <p className="text-gray-600">Tell us a bit about yourself</p>
                </div>

                {/* Error display */}
                {(errors.USNEmail || errors.protusId) && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">
                        Please fix the following errors:
                      </span>
                    </div>
                    <ul className="mt-2 list-inside list-disc text-sm text-red-700">
                      {errors.USNEmail && <li>{errors.USNEmail.message}</li>}
                      {errors.protusId && <li>{errors.protusId.message}</li>}
                    </ul>
                  </div>
                )}

                <div className="space-y-6">
                  {/* USN Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      USN Email Address
                    </label>
                    <p className="mb-3 text-sm text-gray-500">
                      Your USN email will be used for identification during
                      testing. All data will be anonymized in reports.
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("USNEmail")}
                        type="email"
                        className={`w-full rounded-xl border py-3 pl-12 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.USNEmail
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white focus:border-blue-300"
                        }`}
                        placeholder="your.name@usn.no"
                      />
                    </div>
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Student ID
                    </label>
                    <p className="mb-3 text-sm text-gray-500">
                      Your 5-digit student ID starting with 25 (e.g., 25001).
                      For development/testing, use 25001.
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("protusId", { valueAsNumber: true })}
                        type="number"
                        className={`w-full rounded-xl border py-3 pl-12 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.protusId
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white focus:border-blue-300"
                        }`}
                        placeholder="25001"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={validateAndNextStep}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Choose Components
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Component Selection */}
          {currentStep === 2 && (
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Choose Your Dashboard Components
                </h2>
                <p className="text-gray-600">
                  Select the tools that will help you learn most effectively
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {components.map((component) => {
                  const isSelected =
                    selectedComponents?.includes(component.id) || false;
                  return (
                    <div key={component.id} className="group relative">
                      <div
                        onClick={() => handleComponentToggle(component.id)}
                        className={`block cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                          isSelected
                            ? "scale-[1.02] border-blue-500 bg-blue-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {component.title}
                          </h3>
                          <div
                            className={`relative h-6 w-6 rounded-full border-2 transition-colors ${
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 group-hover:border-blue-300"
                            }`}
                          >
                            <CheckCircle2
                              className={`absolute inset-0 h-full w-full text-white transition-opacity ${
                                isSelected ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mb-4 text-sm text-gray-600">
                          {component.description}
                        </p>

                        {/* Preview */}
                        <div className="overflow-hidden rounded-lg bg-gray-50 p-3">
                          <div className="origin-top-left scale-90 transform">
                            {component.preview}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Leaderboard */}
          {currentStep === 3 && (
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Join the Competition
                </h2>
                <p className="text-gray-600">
                  Compete with your classmates and track your progress
                </p>
              </div>

              {mutation.isError && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Error:</span>
                    <span>
                      The ID you submitted is already taken. Please contact
                      support if this is incorrect.
                    </span>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Left side - Options */}
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      Leaderboard Participation
                    </h3>

                    <div className="mb-6">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          {...register("leaderboard")}
                          type="checkbox"
                          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900">
                            Yes, I want to participate in the leaderboard
                          </span>
                          <p className="text-sm text-gray-600">
                            Your nickname will be displayed publicly to compete
                            with classmates
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Nickname field - shows when leaderboard is checked */}
                    {showNameField && (
                      <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <h4 className="font-medium text-blue-900">
                          Choose Your Nickname
                        </h4>
                        <p className="text-sm text-blue-700">
                          This will be displayed publicly on the leaderboard
                        </p>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <User className="h-5 w-5 text-blue-400" />
                          </div>
                          <input
                            {...register("name")}
                            type="text"
                            className={`w-full rounded-xl border py-3 pl-12 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.name
                                ? "border-red-300 bg-red-50"
                                : "border-blue-300 bg-white focus:border-blue-400"
                            }`}
                            placeholder="Enter your nickname"
                          />
                        </div>
                        {errors.name && (
                          <p className="text-sm text-red-600">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right side - Preview */}
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      Preview
                    </h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <LeaderboardPreview />
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <p className="mb-6 text-center text-sm text-gray-600">
                    💡 <strong>Remember:</strong> You can always change these
                    preferences later in Settings
                  </p>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Go Back
                    </button>
                    <button
                      type="submit"
                      disabled={mutation.isLoading}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-3 font-semibold text-white transition-all hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {mutation.isLoading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Setting up...
                        </>
                      ) : mutation.isSuccess ? (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          Success!
                        </>
                      ) : (
                        <>Complete Setup</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
        {/* Extra padding no final para garantir espaço para scroll */}
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default UIOnboarding;
