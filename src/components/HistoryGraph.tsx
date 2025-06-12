import { ActivityResource, ExerciseHistory } from ".prisma/client";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
import { Line } from "react-chartjs-2";
import { api } from "../utils/api";
import { TrendingUp } from "lucide-react";

const HistoryGraph = () => {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const {
    data: history,
    isLoading,
    isSuccess,
  } = api.userRouter.getExerciseHistoryOnUser.useQuery();

  if (isLoading || !isSuccess) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  function grouped(arr: typeof history): typeof history[] {
    if (!arr) {
      return [[]];
    }
    // Use reduce to create a map with completedAt dates as keys and arrays of objects as values
    const groupedMap = arr.reduce(
      (
        acc: Map<string, typeof history>,
        obj: ExerciseHistory & {
          ActivityResource: ActivityResource;
        }
      ) => {
        const dateKey = obj.completedAt!.toISOString().split("T")[0] as string; // Get only the date part of the completedAt field

        if (!acc.has(dateKey)) {
          acc.set(dateKey, []);
        }
        acc.get(dateKey)!.push(obj);
        return acc;
      },
      new Map<string, typeof history>()
    );

    // Convert the map values to an array of arrays
    const groupedArray = Array.from(groupedMap.values());

    return groupedArray as typeof history[];
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#F3F4F6",
        },
      },
      x: {
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#F3F4F6",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        cornerRadius: 8,
        displayColors: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const labels = grouped(history).map((d) => {
    const date = new Date(d![0]?.completedAt!);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Exercises Completed",
        data: grouped(history).map((d) => d!.length),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
      },
    ],
  };

  const totalExercises = history.length;
  const avgPerDay =
    history.length > 0
      ? (totalExercises / grouped(history).length).toFixed(1)
      : 0;

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Activity Graph</h2>
        </div>
        <p className="text-sm text-gray-600">
          Your daily exercise completion over time
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {history && history.length > 0 ? (
          <>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-2xl font-bold text-blue-900">
                  {totalExercises}
                </div>
                <div className="text-sm text-blue-700">Total Exercises</div>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <div className="text-2xl font-bold text-green-900">
                  {avgPerDay}
                </div>
                <div className="text-sm text-green-700">Avg per Day</div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <Line options={options} data={data} />
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No activity yet
            </h3>
            <p className="text-gray-600">
              Your exercise history will show here once you complete your first
              task
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryGraph;
