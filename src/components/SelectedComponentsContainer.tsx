import HistoryGraph from "./HistoryGraph";
import ExerciseHistory from "./home/ExerciseHistory";
import Leaderboard from "./Leaderboard";
import { SelectedEnum } from "@prisma/client";
import ToDoComp from "./todo/ToDoComp";
import CourseCard from "./CourseCard";
import Stats from "./Stats";
import Regula from "./Regula";

interface ISelectedComponentsProps {
  selected: Array<SelectedEnum>;
  leaderboard: boolean;
}

const SelectedComponentsContainer = (props: ISelectedComponentsProps) => {
  const { selected, leaderboard } = props;

  const components: {
    [key: string]: { title: string; component: React.ReactElement };
  } = {
    HISTORYGRAPH: {
      title: "Activity Graph",
      component: <HistoryGraph />,
    },
    STATS: {
      title: "Stats",
      component: <Stats />,
    },
    LEADERBOARD: {
      title: "Leaderboard",
      component: <Leaderboard />,
    },
    TODO: {
      title: "Exercise Planner",
      component: <ToDoComp />,
    },
    EXERCISEHISTORY: {
      title: "History",
      component: <ExerciseHistory />,
    },
    REGULA: {
      title: "Regula",
      component: <Regula />,
    },
  };

  return (
    <div className="space-y-8">
      {/* Seção de Cursos */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          My Courses
        </h2>
        <div className="flex flex-wrap gap-4">
          <CourseCard courseName="java" />
        </div>
      </div>

      {/* Grid de Componentes */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Leaderboard como primeiro item se habilitado */}
        {leaderboard && components["LEADERBOARD"] && (
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
              {components["LEADERBOARD"].title}
            </h2>
            <div className="min-h-[300px]">
              {components["LEADERBOARD"].component}
            </div>
          </div>
        )}

        {/* Componentes selecionados */}
        {selected.map((compEnum: string) => {
          const componentData = components[compEnum];
          if (!componentData) {
            return (
              <div
                key={compEnum}
                className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-lg"
              >
                <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
                  {compEnum}
                </h2>
                <div className="flex min-h-[300px] items-center justify-center text-gray-500">
                  Component not found
                </div>
              </div>
            );
          }

          return (
            <div
              key={compEnum}
              className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-lg"
            >
              <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
                {componentData.title}
              </h2>
              <div className="min-h-[300px]">{componentData.component}</div>
            </div>
          );
        })}
      </div>

      {/* Caso não tenha componentes selecionados */}
      {selected.length === 0 && !leaderboard && (
        <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-gray-800">
          <div className="mx-auto max-w-md">
            <div className="mb-4 text-6xl">📊</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              Empty Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Select components in settings to customize your dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedComponentsContainer;
